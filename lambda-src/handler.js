const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TABLE_NAME = process.env.USERS_TABLE_NAME  // Get the table name from the environment variable

exports.save = async (body) => {
    // event.queryStringParameters is an object containing query string parameters
    const uuid = crypto.randomUUID();  // Generate a random UUID

    const user = {
        id: uuid,
        name: body.name,
        age: body.age || 18
    }

    console.log(user);

    const savedUser = await saveUser(user);  // Save the user to DynamoDB

    return {
        statusCode: 200,
        body: JSON.stringify(savedUser),
    }
}

async function saveUser(user) {
    const params = {  // Create the params for DynamoDB.put()
        TableName: TABLE_NAME,
        Item: user
    };

    console.info(params)

    const response = await dynamo.send(new PutCommand(params));
    console.info("DynamoDB Response:", response);

    return user;
}