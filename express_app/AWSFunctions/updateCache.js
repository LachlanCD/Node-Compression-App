const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// initialise bucket and object variables
const bucketName = "gr87-storage";
const objectKey = "counter.json";
const jsonData = {
    counter: 0,
    data: 'test'
}

export async function getData() {

}

// function to get current counter from s3 and update local object
export async function getObjectFromS3() {
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        const data = await s3.getObject(params).promise();
        const parsedData = JSON.parse(data.Body.toString("utf-8"));
        return parsedData;
    } catch (err) {
        // if the object doesnt exist dont throw an error
        if (err.code !== 'NoSuchKey') throw err;
    }
}

module.exports = router