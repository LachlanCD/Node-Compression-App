const express = require('express');
const router = express.Router();
const { deleteObjectS3 } = require("../AWSFunctions/s3Functions");
const { getKeyDataRedis, deleteKeyRedis } = require("../AWSFunctions/redisFunctions");

// Handle file removal
router.get('/:key', async (req, res, next) => {
  const key = req.params.key;

  try {
    const redisData = JSON.parse(await getKeyDataRedis(key));
    await deleteKeyRedis(key);
    await deleteObjectS3(redisData.location);

    res.status(200).json({ message: `Key ${key} successfully deleted` });

  } catch (err) {
    next(err)
  }
});
  
module.exports = router;