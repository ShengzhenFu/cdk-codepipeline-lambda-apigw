import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cdk from '@aws-cdk/core';
import { CodePipeline,CodePipelineSource, ManualApprovalStep, CodeBuildStep } from '@aws-cdk/pipelines';
import { codepipelineStage } from './codepipeline-stage';

export class codeStarPipelineStack  extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        // ---------------codepipeline implementation with CodeStar github connection-------
        
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

        
        const Prod = new codepipelineStage(this, 'serverlessApp', { env: {
            account: process.env.CDK_DEFAULT_ACCOUNT,
            region: process.env.CDK_DEFAULT_REGION,
        } });

        const endpointUrl = Prod.urlOutput+'/testPath'

        // need approval before deploy app
        basePipeline.addStage(Prod, {
            pre: [
                new ManualApprovalStep('approve deploy', { comment: `endpoint url ${endpointUrl}`} )
            ]
        });
        
        // // validate api endpoint after deployed
        // const endpointUrl = Prod.urlOutput+'/testPath'
        // basePipeline.addStage(Prod, {
        //     post: [
        //         new ShellStep('validate endpoint', {
        //             commands: [`curl -Ssf ${endpointUrl}`]
        //         }),
        //     ],
        // });
       
    }
}