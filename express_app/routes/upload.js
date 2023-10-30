const express = require('express');
const multer = require('multer');
const router = express.Router();
const { spawn } = require('child_process');
const { uploadToS3 } = require("../AWSFunctions/s3Functions")

// Define a storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle file upload and compression
router.post('/', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    try {

        const compressedFiles = await Promise.all(
            req.files.map(async (file, index) => {
                const compressedBuffer = await compressWithBzip2(file.buffer);
                const s3Key = `${file.originalname}.bzip2`;
                await uploadToS3(compressedBuffer, s3Key);
                return s3Key;
            })
        );

        // Return a response to the client with the list of S3 keys for the compressed files
        res.json({ message: 'Files compressed and uploaded to S3', compressedFiles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error compressing the file' });
    }
});


// Function to compress a buffer using Bzip2
async function compressWithBzip2(inputBuffer) {
    return new Promise((resolve, reject) => {
        const bzip2 = spawn('bzip2', ['-c']);

        bzip2.stdin.write(inputBuffer);
        bzip2.stdin.end();

        const compressedData = [];

        bzip2.stdout.on('data', (data) => {
            compressedData.push(data);
        });

        bzip2.stdout.on('end', () => {
            resolve(Buffer.concat(compressedData));
        });

        bzip2.on('error', (err) => {
            reject(err);
        });
    });
}
  
module.exports = router;