const express = require('express');
const router = express.Router();
const { downloadFromS3 } = require("../AWSFunctions/s3Functions")

// Handle file upload and compression
router.get('/:key', async (req, res) => {
    const fileKey = req.params.key;

    try {
        const fileData = await downloadFromS3(fileKey);
        res.setHeader('Content-Disposition', `attachment; filename=${fileData.fileName}`);
        res.setHeader('Content-Type', fileData.contentType);
        res.send(fileData.content);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error compressing the file' });
    }
});
  
module.exports = router;