#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsCdkStartedStack } from '../lib/aws-cdk-started-stack';

const app = new cdk.App();
new AwsCdkStartedStack(app, 'AwsCdkStartedStack');
