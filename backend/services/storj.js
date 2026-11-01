
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

  const getFromStorj = async key =>
    storjClient.send(
      new GetObjectCommand({
        Bucket: process.env.STORJ_BUCKET,
        Key: key,
      }),
    );

  const storjClient = new S3Client({
    endpoint: process.env.STORJ_ENDPOINT,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.STORJ_ACCESS_KEY,
      secretAccessKey: process.env.STORJ_SECRET_KEY,
    },
  });

  const uploadToStorj = async ({
    key,
    body,
    contentType,
  }) => {
    const command = new PutObjectCommand({
      Bucket: process.env.STORJ_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await storjClient.send(command);

    return key;
  };

module.exports = {
  uploadToStorj,
  getFromStorj,
};