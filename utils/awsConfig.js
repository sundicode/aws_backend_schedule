import aws from "aws-sdk";
import { v4 } from "uuid";
import { PutObjectAclCommand, S3Client } from "@aws-sdk/client-s3";
const s3Uploadv2 = async (files,folder) => {
  const s3 = new aws.S3();
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${v4()}-${file.originalname}`,
      Body: file.buffer,
    };
  });
  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};

const s3Uploadv3 = async (req, res) => {
  const s3client = new S3Client();
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${v4()}-${file.originalname}`,
    Body: file.buffer,
  };

  return await s3client.send(new PutObjectAclCommand(params));
};
export { s3Uploadv2 };
