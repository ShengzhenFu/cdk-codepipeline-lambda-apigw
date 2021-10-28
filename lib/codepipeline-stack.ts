import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkCodepipelineLambdaApigwStack } from './cdk-codepipeline-lambda-apigw-stack';


export class MyPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const githubConnectionArn = 'arn:aws:codestar-connections:us-west-2:440900076177:connection/26bc6d92-2dda-46b7-aacd-f2a901543f00'
    const serviceSourceOutput = new codepipeline.Artifact()
    const serviceSourceAction = new actions.CodeStarConnectionsSourceAction({
        actionName: 'Service_Source',
        owner: 'ShengzhenFu',
        repo: 'cdk-codepipeline-lambda-apigw',
        branch: 'codepipeline',
        connectionArn: githubConnectionArn,
        codeBuildCloneOutput: true,
        output: serviceSourceOutput
    })

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('ShengzhenFu/cdk-codepipeline-lambda-apigw', 'codepipeline', {
            connectionArn: githubConnectionArn
        }),
        commands: ['npm ci && npm ci --prefix lambda', 'npx cdk synth']
      })
    });

    const appStack = new CdkCodepipelineLambdaApigwStack(this, 'appDeploy', {
        env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    })
    

  }
}