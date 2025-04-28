import * as path from "node:path";
import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'

const TABLE_NAME = 'Users'

export class AwsCdkStartedStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // L2: DynamoDb Table
        const dynamoUsersTable = new dynamo.Table(this, TABLE_NAME, {
            partitionKey: {
                name: 'id',
                type: dynamo.AttributeType.STRING
            }
        })

        // L2: Lambda Function
        const saveUsersLambda = new lambda.Function(this, 'SaveUsersLambda', {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler.save',
            code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'lambda-src')),
            environment: {
                USERS_TABLE_NAME: TABLE_NAME,
            }
        })
        dynamoUsersTable.grantReadWriteData(saveUsersLambda)  // Give permissions to lambda to read and write

        // L2: API Gateway
        const usersApiGateway = new apiGateway.RestApi(this, 'UsersApiGateway')
        usersApiGateway.root
            .resourceForPath('users')
            .addMethod('POST', new apiGateway.LambdaIntegration(saveUsersLambda))
    }
}
