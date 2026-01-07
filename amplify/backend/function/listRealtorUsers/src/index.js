/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const {
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

exports.handler = async () => {
  try {
    const USER_POOL_ID = process.env.USER_POOL_ID;

    if (!USER_POOL_ID) {
      throw new Error("USER_POOL_ID not set");
    }

    const command = new ListUsersInGroupCommand({
      UserPoolId: USER_POOL_ID,
      GroupName: "realtor",
    });

    const response = await client.send(command);

    const users = (response.Users || []).map((user) => {
      const emailAttr = user.Attributes.find(
        (a) => a.Name === "email"
      );

      return {
        sub: user.Username, // Cognito user sub
        email: emailAttr?.Value || "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error("Error listing realtor users:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
