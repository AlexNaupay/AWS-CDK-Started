#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkStartedStack } from '../lib/aws-cdk-started-stack';

const app = new cdk.App();
// const env = app.node.tryGetContext('env') || 'dev'; // Por defecto, usa 'dev'

new AwsCdkStartedStack(app, 'AwsCdkStartedStack');
