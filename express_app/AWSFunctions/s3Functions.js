require('dotenv').config
const AWS = require('aws-sdk');

AWS.config.update({region:'ap-southeast-2'});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// initialise bucket and object variables
const bucketName = "gr87-storage";

/* GET and update page visit counter. */
async function uploadToS3 (data, key) {
    try {
        await createBucket();
        await uploadFileToS3(data, key);

    } catch (err) {
        throw err
    }
};

async function downloadFromS3 (fileKey) {
    try {
        const data = await s3.getObject({ Bucket: bucketName, Key: fileKey }).promise();
        const fileContent = data.Body;
        const fileName = fileKey;

        return {
            content: fileContent,
            contentType: data.ContentType,
            fileName: fileName,
        }
    } catch (err) {
        throw err;
    }
}

// function to create a new bucket
async function createBucket (){
    try {
        await s3.createBucket( { Bucket:bucketName }).promise();
    } catch (err) {
        // if the bucket exists, dont throw an error
        if (err.statusCode !== 409) throw err;
    }
}

// function to upload the local object to the s3 bucket
async function uploadFileToS3 (data, key) {
    return s3.upload({ Bucket: bucketName, Key: key, Body: data}).promise();
}

module.exports = {uploadToS3, downloadFromS3};
