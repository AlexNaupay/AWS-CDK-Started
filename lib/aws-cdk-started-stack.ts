import * as path from "node:path";
import {Duration, Stack, StackProps, CfnOutput} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamo from 'aws-cdk-lib/aws-dynamodb'
import * as apiGateway from 'aws-cdk-lib/aws-apigateway'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as process from "node:process";

export class AwsCdkStartedStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // L2: DynamoDb Table
        const dynamoUsersTable = new dynamo.Table(this, 'Users', {
            tableName: 'Users', // Explicitly naming the table
            partitionKey: {
                name: 'id',
                type: dynamo.AttributeType.STRING
            }
        })

        // L2: Lambda Function
        const saveUsersLambda = new lambda.Function(this, 'SaveUsersLambda', {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler.save',
            code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'lambda-src/save')),
            environment: {
                USERS_TABLE_NAME: dynamoUsersTable.tableName,
            }
        })

        const listUsersLambda = new lambda.Function(this, 'ListUsersLambda', {
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: 'handler.list',
            code: lambda.Code.fromAsset(path.resolve(__dirname,'../lambda-src/list')),
            environment: {
                USERS_TABLE_NAME: dynamoUsersTable.tableName,
            }
        })

        // const vpc = new ec2.Vpc(this, 'MyVpc', )
        /*const vpc = ec2.Vpc.fromLookup(this, 'MyDefaultVpc', { isDefault: true})  // Default
        const ec2Server = new ec2.Instance(this, 'Ec2Server', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
        })*/

        //dynamoUsersTable.grantFullAccess(saveUsersLambda)
        dynamoUsersTable.grantReadWriteData(saveUsersLambda)  // Give permissions to lambda to read and write
        dynamoUsersTable.grantReadData(listUsersLambda)
        //props?.downstream.grantInvoke(saveUsersLambda)
        /*saveUsersLambda.addToRolePolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['dynamodb:PutItem'],
                resources: [dynamoUsersTable.tableArn]
            })
        )*/

        // L2: API Gateway
        const usersApiGateway = new apiGateway.RestApi(this, 'UsersApiGateway')
        usersApiGateway.root
            .resourceForPath('users')
            .addMethod('POST', new apiGateway.LambdaIntegration(saveUsersLambda))

        usersApiGateway.root
            .resourceForPath('users')
            .addMethod('GET', new apiGateway.LambdaIntegration(listUsersLambda))

        // Output the API Gateway URL
        new CfnOutput(this, 'ApiEndpoint', {
            value: usersApiGateway.url,
            description: 'API Gateway endpoint URL',
        });

        // Output the DynamoDB Table name
        new CfnOutput(this, 'DynamoDBTableName', {
            value: dynamoUsersTable.tableName,
            description: 'DynamoDB Table Name',
        });

    }
}
