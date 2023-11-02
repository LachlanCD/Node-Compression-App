const express = require('express');
const router = express.Router();
const { deleteObjectS3 } = require("../AWSFunctions/s3Functions");
const { getKeyDataRedis, deleteKeyRedis } = require("../AWSFunctions/redisFunctions");

// Handle file removal
router.get('/:key', async (req, res, next) => {
  const key = req.params.key;

  try {
    console.log(key)

    const redisData = await getKeyDataRedis(key);
    const redisDataJSON = JSON.parse(redisData);

    console.log(redisDataJSON)

    await deleteObjectS3(redisDataJSON.Location);
    await deleteKeyRedis(key);

    res.status(200).json({ message: `Key ${key} successfully deleted` });

  } catch (err) {
    next(err)
  }
});
  
module.exports = router;