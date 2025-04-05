import S3Config from '@config/S3config';
import {Buffer} from 'buffer';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';

export const uploadImageToS3 = async (imageUri: string) => {
  if (!imageUri) {
    return;
  }

  return new Promise(async (resolve, reject) => {
    const fileData = await RNFS.readFile(imageUri, 'base64');

    const params = {
      Bucket: S3Config.bucket,
      Key: new Date().toISOString(), // File name you want to save as in S3
      Body: Buffer.from(fileData, 'base64'),
      ContentType: 'image/jpeg',
    };

    const s3 = new AWS.S3({
      accessKeyId: S3Config.accessKeyID,
      secretAccessKey: S3Config.secretAccessKey,
      region: S3Config.region,
    });

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data.Location);
      }
    });
  });
};

