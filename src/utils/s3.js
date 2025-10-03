import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const getFileFromS3 = async (Key) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION
    })

    const data = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key
      })
    )

    return { data, success: true }
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in getFileFromS3 💥', err)
    throw err
  }
}

export const uploadFileToS3 = async (Body, Key) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION
    })

    const data = await s3Client.send(
      new PutObjectCommand({
        Body,
        Bucket: process.env.AWS_S3_BUCKET,
        Key
      })
    )

    return { data, success: true }
  } catch (err) {
    console.error('❌ [EMAIL-LAMBDA] Error happened in uploadFileToS3 💥', err)
    throw err
  }
}
