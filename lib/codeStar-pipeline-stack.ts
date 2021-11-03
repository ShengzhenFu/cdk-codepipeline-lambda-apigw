import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as cdk from '@aws-cdk/core';
import { CodePipeline,CodePipelineSource, ShellStep, CodeBuildStep } from '@aws-cdk/pipelines';
import * as codebuild from '@aws-cdk/aws-codebuild';


export class codeStarPipelineStack  extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // ---------------codepipeline implementation with CodeStar github connection-------
        const serviceSourceOutput = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact;
        const sourceArtifact = new codepipeline.Artifact();

        const serviceSourceAction = new actions.CodeStarConnectionsSourceAction({
            actionName: 'Service_source',
            owner: 'ShengzhenFu',
            repo: 'cdk-codepipeline-lambda-apigw',
            branch: 'codepipeline',
            connectionArn: 'arn:aws:codestar-connections:us-west-2:440900076177:connection/26bc6d92-2dda-46b7-aacd-f2a901543f00',
            codeBuildCloneOutput: true,
            output: serviceSourceOutput,
        });
     
        // const basePipeline = SimpleSynthAction.standardNpmSynth({
        //     sourceArtifact,
        //     cloudAssemblyArtifact,
        //     environment: {
        //         buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        //         privileged: true,
        //     },
        //     synthCommand: 'npx cdk synth',
        // });
        

        // const basePipeline = new CodePipeline(this, 'codeStarPipeline', {
        //     pipelineName: 'pipeline',
        //     synth: new ShellStep('Synth', {
        //         input: CodePipelineSource.connection('ShengzhenFu/cdk-codepipeline-lambda-apigw', 'codepipeline', {
        //             connectionArn: 'arn:aws:codestar-connections:us-west-2:440900076177:connection/26bc6d92-2dda-46b7-aacd-f2a901543f00'
        //         }),
        //         commands: ['mkdir cdk.out','npm config set fund false && npm i --silent', 'npm run build'],
        //         primaryOutputDirectory: './cdk.out'
        //     }),
        //     crossAccountKeys: false,
        //     dockerEnabledForSynth: true,
        //     dockerEnabledForSelfMutation: true,
        // });

        const basePipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            synth: new CodeBuildStep('SynthStep', {
                    input: CodePipelineSource.connection('ShengzhenFu/cdk-codepipeline-lambda-apigw', 'codepipeline', {
                        connectionArn: 'arn:aws:codestar-connections:us-west-2:440900076177:connection/26bc6d92-2dda-46b7-aacd-f2a901543f00'
                    }),
                    installCommands: [
                        'npm install -g aws-cdk'
                    ],
                    commands: [
                        'npm config set fund false && npm i --silent',
                        'npm run build',
                        'npx cdk synth'
                    ]
                }
            ),
            dockerEnabledForSynth: true,
        });
    }
}