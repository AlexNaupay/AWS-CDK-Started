const AWS = require('aws-sdk');
const crypto = require("crypto");

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.USERS_TABLE_NAME  // Get the table name from environment variable

exports.save = async (event) => {
    // event.queryStringParameters is an object containing query string parameters
    const body = JSON.parse(event.body);  // Parse the body to JSON
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

    return dynamo.put(params)
        .promise().then((response) => {
            console.info(response);
            return user;
        });
}