import * as path from "node:path";
import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'

const TABLE_NAME = 'Greetings'

export class AwsCdkStartedStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // L2: DynamoDb Table
        const dynamoGreetingsTable = new dynamo.Table(this, TABLE_NAME, {
            partitionKey: {
                name: 'id',
                type: dynamo.AttributeType.STRING
            }
        })

        // L2: Lambda Function
        const saveGreetingsLambda = new lambda.Function(this, 'SaveGreetingsLambda', {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler.saveGreeting',
            code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda-src')),
            environment: {
                GREETINGS_TABLE_NAME: TABLE_NAME,
            }
        })
        dynamoGreetingsTable.grantReadWriteData(saveGreetingsLambda)  // Give permissions to lambda to read and write

        // L2: API Gateway
        const greetingsApiGateway = new apiGateway.RestApi(this, 'GreetingsApiGateway')
        greetingsApiGateway.root
            .resourceForPath('greeting')
            .addMethod('POST', new apiGateway.LambdaIntegration(saveGreetingsLambda))
    }
}
