const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand  } = require("@aws-sdk/lib-dynamodb");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.USERS_TABLE_NAME  // Get the table name from the environment variable

exports.list = async (event) => {
    console.info("----------- Starting to list user -----------");
    console.log(event);

    const users = await listUsers();  // Save the user to DynamoDB

    return {
        statusCode: 200,
        body: JSON.stringify(users),
    }
}

async function listUsers() {
    const params = {  // Create the params for DynamoDB.put()
        TableName: TABLE_NAME,
    };

    console.info(params)

    const response = await dynamo.send(new ScanCommand(params));
    console.info("DynamoDB Response:", response);

    return response.Items;
}