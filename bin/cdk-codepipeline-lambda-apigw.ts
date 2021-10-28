#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkCodepipelineLambdaApigwStack } from '../lib/cdk-codepipeline-lambda-apigw-stack';
import { MyPipelineStack } from '../lib/codepipeline-stack'

const app = new cdk.App();
// new CdkCodepipelineLambdaApigwStack(app, 'CdkCodepipelineLambdaApigwStack', {
//      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
// });
new MyPipelineStack(app, 'myPipelineStack', {
     env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
})

app.synth();