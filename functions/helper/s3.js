const AWS = require('aws-sdk');

exports.uploadImage = (imageURL) => {
  AWS.config.loadFromPath('../config.json');
  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const uploadParams = {
    Bucket: 'amplify-orbital-dev-224539-deployment',
    Key: 'Hi',
    Body: Buffer.from(imageURL, 'base64').toString(),
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err);
        return;
      }
      if (data) {
        resolve(data);
      }
    });
  });
};
