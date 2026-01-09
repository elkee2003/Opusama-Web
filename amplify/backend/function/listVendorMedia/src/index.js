/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_S3OPUSAMASTORAGEF8B382AA_BUCKETNAME
Amplify Params - DO NOT EDIT */

const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const {
  getSignedUrl,
} = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

// ✅ Amplify-injected bucket name
const BUCKET =
  process.env.STORAGE_S3OPUSAMASTORAGEF8B382AA_BUCKETNAME;

exports.handler = async (event) => {
  try {
    const vendorSub =
      event.queryStringParameters?.vendorSub;

    if (!vendorSub) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "vendorSub is required",
        }),
      };
    }

    // 🔐 SAFETY: vendor-scoped access only
    const prefix = `public/media/${vendorSub}/`;

    const listResult = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
      })
    );

    if (!listResult.Contents || listResult.Contents.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      };
    }

    const media = await Promise.all(
      listResult.Contents.map(async (item) => {
        const signedUrl = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: BUCKET,
            Key: item.Key,
          }),
          { expiresIn: 600 } // 10 minutes
        );

        return {
          key: item.Key,
          url: signedUrl,
          type: item.Key.match(/\.(mp4|mov|webm)$/i)
            ? "video"
            : "image",
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(media),
    };
  } catch (err) {
    console.error("S3 error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to list media",
      }),
    };
  }
};
