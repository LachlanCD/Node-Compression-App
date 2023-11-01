const express = require('express');
const router = express.Router();
const { getCacheData } = require("../AWSFunctions/redisFunctions")

// Return keys and data from AWS Elasticache
router.get('/', async (res, next) => {
  try {
    console.log('test')
    const keyValueData = await getCacheData();
    res.status(200).json(keyValueData);
      
  } catch (err) {
    next(err)
  }
});

module.exports = router;