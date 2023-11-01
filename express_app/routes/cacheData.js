const express = require('express');
const router = express.Router();
const { getCacheData } = require("../AWSFunctions/redisFunctions")

// Return keys and data from AWS Elasticache
router.get('/', async (req, res) => {
  try {
    const keyValueData = await getCacheData();

    res.status(200).json(keyValueData);
      
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error compressing the file' });
  }
});

module.exports = router;