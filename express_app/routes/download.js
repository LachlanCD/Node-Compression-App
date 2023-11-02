const express = require('express');
const router = express.Router();
const { downloadFromS3 } = require("../AWSFunctions/s3Functions")

// Handle file download
router.get('/:key', async (req, res, next) => {
    const fileKey = req.params.key;

    try {
        const fileData = await downloadFromS3(fileKey);
        res.setHeader('Content-Disposition', `attachment; filename=${fileData.fileName}`);
        res.setHeader('Content-Type', fileData.contentType);
        res.status(200)
        res.json({ message: `files ${fileKey} successfully downloaded` });
        res.send(fileData.content);
    } catch (err) {
        next(err)
    }
});
  
module.exports = router;