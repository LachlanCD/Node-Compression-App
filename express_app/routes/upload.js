const express = require("express");
const multer = require("multer");
const router = express.Router();
const { spawn } = require("child_process");
const { uploadToS3 } = require("../AWSFunctions/s3Functions")
const { makeNewKeyPairRedis } = require("../AWSFunctions/redisFunctions");

// Define a storage engine for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle file upload and compression
router.post("/", upload.array("files"), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) throw { status: 400, message: "No files uploaded" };
    const compressedFiles = await uploadFiles(req.files);

    // Return a response to the client with the list of S3 keys for the compressed files
    res.status(200).json({ message: "Files compressed and uploaded to S3", compressedFiles });
  } catch (err) {
    next(err)
  }
});

async function uploadFiles(files) {
  const compressedFiles = await files.map(async (file) => {

    const compressedBuffer = await compressWithXz(file.buffer);
    const s3Key = `${file.originalname}.xz`;
    await uploadToS3(compressedBuffer, s3Key);

    await makeNewKeyPairRedis(file.originalname, s3Key, file.mimetype)

    return s3Key;
  });

  return compressedFiles;
}


// Function to compress a buffer using Bzip2
async function compressWithXz(inputBuffer) {
  return new Promise((resolve, reject) => {
    const xz = spawn("xz", ["-c", "-9e"]);

    xz.stdin.write(inputBuffer);
    xz.stdin.end();

    const compressedData = [];

    xz.stdout.on("data", (data) => {
      compressedData.push(data);
    });

    xz.stdout.on("end", () => {
      resolve(Buffer.concat(compressedData));
    });

    xz.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = router;