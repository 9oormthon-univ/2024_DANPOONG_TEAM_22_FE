import RNFS from 'react-native-fs';

import S3Config from '@config/S3config';
import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

export const uploadImageToS3 = async (imageUri: string) => {
  if (!imageUri) {
    return;
  }

  return new Promise((resolve, reject) => {
    const uploadToS3 = async () => {
      try {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s3.upload(params, function (err: any, data: { Location: unknown }) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data.Location);
          }
        });
      } catch (error) {
        reject(error);
      }
    };

    uploadToS3();
  });
};
