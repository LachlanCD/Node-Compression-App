const express = require('express');
const { spawn } = require('child_process');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const { Readable } = require('stream');
const uploadToS3 = require("../S3Functions/s3Upload")


// Define a storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Handle file upload and compression
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Compress the uploaded file using Bzip2
        const uncompressedBuffer = req.file.buffer;
        const compressedBuffer = await compressWithBzip2(uncompressedBuffer);

        const s3Key = `${req.file.originalname}.bzip2`
        await uploadToS3(compressedBuffer, s3Key)

        // Return a response to the client
        res.json({ message: 'File compressed and uploaded to S3' });


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