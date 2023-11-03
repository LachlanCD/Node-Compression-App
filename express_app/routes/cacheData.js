const express = require("express");
const router = express.Router();
const { getDataRedis } = require("../AWSFunctions/redisFunctions")

// Return keys and data from AWS Elasticache
router.get("/", async (req, res, next) => {
  try {
    const keyValueData = await getDataRedis();
    res.status(200).json(keyValueData);

  } catch (err) {
    next(err)
  }
});

module.exports = router;