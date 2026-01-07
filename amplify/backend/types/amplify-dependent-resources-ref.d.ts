export type AmplifyDependentResourcesAttributes = {
  "api": {
    "OpusamaRealtor": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    },
    "sendGuestTicketApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "OpusamaRealtor": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "listRealtorUsers": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "notifyVendorBooking": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "sendGuestTicket": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "s3opusamastoragef8b382aa": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}