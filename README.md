# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`AwsCdkStartedStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


## Commands
`cdk bootstrap`         Deploys the CDK toolkit stack into an AWS environment
`cdk bootstrap aws://ACCOUNT_ID/REGION`
`cdk init --language typescript`
`cdk docs`              Open docs on Browser
`cdk deploy`            Deploy
`cdk synth > cf.yml`    Emits the synthesized CloudFormation template
`cdk destroy`    Emits the synthesized CloudFormation template

```bash
# Help
cdk --help
cdk deploy --help

```