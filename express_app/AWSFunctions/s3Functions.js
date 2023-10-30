const AWS = require('aws-sdk');
require('dotenv').config

// set AWS credentials to env variables
AWS.config.update({
    aws_access_key_id:"ASIA5DYSEEJ453MN7W5Z",
    aws_secret_access_ke:"d0mMtBqV4Dj6U9wlGMXbD/HbNH327bCrHh8GUwMB",
    aws_session_token:"IQoJb3JpZ2luX2VjEKj//////////wEaDmFwLXNvdXRoZWFzdC0yIkcwRQIgVkBOGKHyYmFpFzengl/6lGYOZS8X9iLbk49uAR+AB+ICIQCzRtOGMRYLuRXzXyBX0DZqyBB6w923x+3bTYZhPowEGCquAwjR//////////8BEAMaDDkwMTQ0NDI4MDk1MyIMCykoPtPl24yBLJ7hKoIDIDLFzPwIik0r/M60/OirJlqn+HxBQxNTPL12nrdwgZeVSPPc4GVeoPyJ89wGlXr2FekV/TaFmLmcXOAUcFiYwyx1bTkfLMx43p8kPN1ObYuM2t1LgwXEQhlWL5GrQx35Z/xwtMGMta9jpwNtbuteggVNBMqmKodjlly4qxy7ftRmRvvkK/O94kGp2OVP9d8e+9LIox2NbtFPd9PnQhYz7g3lB3S7uQSY0nt8PWwu/XRfwyr9TiGqBjzK8E3ZMpnOH27W8++Q7NZ8Iraiahnp4NNR8GGSDEt/WDBKjCeXgKE6dmjm0td6kj5VpxTz6F4jrdQ/k6uGTVC0W24GkbjhDI0EzMY0IWuNrJOkyZJOTD2iMyHRbQDQwxuLc6cuACTI4APR8UwJHJBpkbz5VZi3UFay0+SiiGanwquVRJZQc2QfI0i+Rj6XmNLVqHZxA1uT1EMfE2NHiRaxDd3XQcTV+wjMPwbdMgm3trP53hHoJ9vk+qLyel9wKylBaTpcFamOFWUwurr9qQY6pgGDmiQks0MMRVm/tP24NR609ScrpV+3f/Ab5sFnyhPQgUittZCXRM1tldlgVr7c0wUe4nXkt8DAYZOSlsTn+1sUuUNvErUhUN8HsnZmCv8ve+cd+QY/M61RIN1EnSjHAPm2SG8lQHFNZMKKe5vZRAvF1lpJhQalscykWu8hRRVlAerjiUYvSy7KbtuAp08aqqOhuvbuq+UhstIivaxywfsh7YtAyYmr",
    region: "ap-southeast-2"
});

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
