/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const {
  CognitoIdentityProviderClient,
  ListUsersInGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const listUsersInGroup = async (userPoolId, groupName) => {
  let users = [];
  let nextToken;

  do {
    const command = new ListUsersInGroupCommand({
      UserPoolId: userPoolId,
      GroupName: groupName,
      NextToken: nextToken,
    });

    const response = await client.send(command);

    users.push(
      ...(response.Users || []).map((user) => {
        const emailAttr = user.Attributes.find(
          (a) => a.Name === "email"
        );

        return {
          sub: user.Username,
          email: emailAttr?.Value || "",
          group: groupName,
        };
      })
    );

    nextToken = response.NextToken;
  } while (nextToken);

  return users;
};

exports.handler = async () => {
  try {
    const USER_POOL_ID = process.env.USER_POOL_ID;
    if (!USER_POOL_ID) {
      throw new Error("USER_POOL_ID not set");
    }

    const groups = ["realtor", "user"];

    // Fetch users from all groups
    const results = await Promise.all(
      groups.map((group) =>
        listUsersInGroup(USER_POOL_ID, group)
      )
    );

    // Flatten array
    const mergedUsers = results.flat();

    // De-duplicate by sub
    const uniqueUsersMap = new Map();

    mergedUsers.forEach((user) => {
      if (!uniqueUsersMap.has(user.sub)) {
        uniqueUsersMap.set(user.sub, {
          sub: user.sub,
          email: user.email,
          groups: [user.group],
        });
      } else {
        uniqueUsersMap
          .get(user.sub)
          .groups.push(user.group);
      }
    });

    const uniqueUsers = Array.from(
      uniqueUsersMap.values()
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify(uniqueUsers),
    };
  } catch (error) {
    console.error("Error listing users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
