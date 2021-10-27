import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import * as path from 'path';
import { LambdaRestApi }  from '@aws-cdk/aws-apigateway';
import { CfnOutput } from '@aws-cdk/core';


export class CdkCodepipelineLambdaApigwStack extends cdk.Stack {
  public apiUrl: CfnOutput;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myFunction = new NodejsFunction(this, 'my-function', {
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../lambda/app.ts`),
      environment: {
        KEY1: "VALUE1"
      }
    });

    const apigw = new LambdaRestApi(this, 'hi-lambda-typescript', {
      handler: myFunction,
      restApiName: 'hi lambda typescript',
      deploy: true,
      deployOptions: {
        stageName: 'beta',
        description: 'cdk lambda deployment'
      }
    });

     this.apiUrl = new cdk.CfnOutput(this, 'apiUrl', {value: apigw.url})
  }
}
