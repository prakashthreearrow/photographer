import AWS from 'aws-sdk'

let awsCredential = {
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY
}
AWS.config.update(awsCredential)
export const s3 = new AWS.S3({
  endpoint: process.env.REACT_APP_AWS_BASE_URL,
  params: { Bucket: process.env.REACT_APP_BUCKET_NAME },
  region: process.env.REACT_APP_REGION,
});
