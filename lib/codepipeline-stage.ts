import { CfnOutput, Construct, Stage, StageProps } from "@aws-cdk/core";
import { CdkCodepipelineLambdaApigwStack } from './cdk-codepipeline-lambda-apigw-stack';

/**
 * Deployment of the lambda + apigw
 */
export class codepipelineStage extends Stage {
    public readonly urlOutput: CfnOutput;

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new CdkCodepipelineLambdaApigwStack(this, 'WebService');
        this.urlOutput = service.apiUrl
    }
}