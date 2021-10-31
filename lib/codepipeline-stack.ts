import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, ShellStep, SimpleSynthAction, CodePipelineSource, CodePipeline } from '@aws-cdk/pipelines';
import { LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { codepipelineStage } from './codepipeline-stage'
import { TIMEOUT } from 'dns';

export class CdkpipelinesStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,
      

      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'Github',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-token'),
        owner: 'ShengzhenFu',
        repo: 'cdk-codepipeline-lambda-apigw',
        branch: 'codepipeline',
        
      }),
      
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        environment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,          
          privileged: true,
        },        
      }),
    });
     
    pipeline.addApplicationStage(new codepipelineStage(this, 'deployApp', {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
    }))
  }
}





// import * as cdk from '@aws-cdk/core';
// import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
// import * as codepipeline from '@aws-cdk/aws-codepipeline';
// import * as actions from '@aws-cdk/aws-codepipeline-actions';
// import { codepipelineStage } from './codepipeline-stage';


// export class MyPipelineStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     const githubConnectionArn = 'arn:aws:codestar-connections:us-west-2:440900076177:connection/26bc6d92-2dda-46b7-aacd-f2a901543f00'
//     const serviceSourceOutput = new codepipeline.Artifact()
//     const serviceSourceAction = new actions.CodeStarConnectionsSourceAction({
//         actionName: 'Service_Source',
//         owner: 'ShengzhenFu',
//         repo: 'cdk-codepipeline-lambda-apigw',
//         branch: 'codepipeline',
//         connectionArn: githubConnectionArn,
//         codeBuildCloneOutput: true,
//         output: serviceSourceOutput
//     })

//     const pipeline = new CodePipeline(this, 'Pipeline', {
//       pipelineName: 'MyPipeline',
//       synth: new ShellStep('SynthStep', {
//         input: CodePipelineSource.connection('ShengzhenFu/cdk-codepipeline-lambda-apigw', 'codepipeline', {
//             connectionArn: githubConnectionArn
//         }),
//         installCommands: ['npm install -g aws-cdk'],
//         commands: ['npm config set fund false', 'npm i --silent'],
//         })
//       }
//     );

//     const appStack = new codepipelineStage(this, 'appDeploy', {
//         env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//     })
//   }
// }

