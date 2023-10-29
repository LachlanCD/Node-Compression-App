const AWS = require('aws-sdk');
require('dotenv').config

// set AWS credentials to env variables
AWS.config.update({
    aws_access_key_id:"ASIA5DYSEEJ47MYE4U7L",
    aws_secret_access_ke:"7iAfwImtihVo5IoiBt+uFpb1lLlIpGxy51jhi6Ya",
    aws_session_token:"IQoJb3JpZ2luX2VjEJb//////////wEaDmFwLXNvdXRoZWFzdC0yIkcwRQIgc7JcYDo0t8DgKk3X8ej0eklSjoxDsRvWoskPWqT64fsCIQDZxS/F19wGbr+aKvwRXOF4NYICbRFrPDzn7PC6TYE6TyquAwi///////////8BEAMaDDkwMTQ0NDI4MDk1MyIMlGpG7EOZ43R9Jo7cKoIDyx6JeacHWQKIcbSYlvaj3yEOCP3FVRCHXx42Z/1wH6QCWqQU7n12SMF/Ib8KOQvnzpB/8tq31JVp7kpXGBo7cHMzA86AdhVYlH/6nOVYk/ktSUwoNTjAF4Pm9IWKCZa0bxm+YemA9XfQ9b+FyxlySJJxLeFfZM9cOUVcPqlME7c40mbvVnRHIS9jxVWSEXJxdl7qP8UILRDMIbBBhPPzbh0mvQkvnmwWY0kC4uBBDnoKYiSlVW2/3efs7r/n7SwAFfP7e2NTcHVw0pmpYKtf309xB/YoPMIzDDwY8ervNI+ABudY5xPtUgjbReIWN2oOXnhlBTE8DfzTsue4jzhZqLjCbc3XcGpuHquvFZ4G2T5wI9Kxdf+/6WrI39OYIDLK30elhEmhYS2baUFXfyoPhxlaWgB48leiWJx5Svu7DQUJhDIcIFRAFCtxK5db+fBajsU2VDMQlzzBd5P2lVdliADhiEmFgGgsMmLpaFVBO6r4D5Yr4Rk4n0I5KPTd7UeSpiYwjM/5qQY6pgHDfpIAjRfpBjkGTZ3HkayY+l1Uv5OKwcLRNot7RSB6XADZzNYgUamYgNKpoyAzZ4PJmi0aozkVmtjyhnCy9auFKwraa3TXhPRKKn6+YOQqsGAhChUX56uNY+HkCZUIbHtxoUIYRX4lU88ySIZ5q3WnmMfa2Cx+Sm9LErHOp6AYLBKpdfe2oACxckjtbqnSuwKz9vv+dUjnTTTe4g+uzXRVYSznG5Dy",
    region: "ap-southeast-2"
});

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// initialise bucket and object variables
const bucketName = "gr87-storage";

/* GET and update page visit counter. */
async function uploadToS3(data, key) {

    try {
        await createBucket();
        await uploadFileToS3(data, key);

    } catch (err) {
        throw err
    }
};

// function to create a new bucket
async function createBucket(){

    try {
        await s3.createBucket( { Bucket:bucketName }).promise();
    } catch (err) {
        // if the bucket exists, dont throw an error
        if (err.statusCode !== 409) throw err;
    }
}

// function to upload the local object to the s3 bucket
async function uploadFileToS3(data, key) {

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: data,
    };

    return s3.upload(params).promise();
}

module.exports = uploadToS3;
