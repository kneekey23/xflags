import cdk = require('@aws-cdk/core');
import { XflagsContainersStack } from './xflags_containers-stack';
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import cicd = require('@aws-cdk/app-delivery');
import codebuild = require('@aws-cdk/aws-codebuild')

//const app = new cdk.App();

export class XFlagsPipelineStack extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // We define a stack that contains the CodePipeline
    const pipelineStack = new cdk.Stack(this, 'PipelineStack');
    const pipeline = new codepipeline.Pipeline(pipelineStack, 'CodePipeline', {
      // Mutating a CodePipeline can cause the currently propagating state to be
      // "lost". Ensure we re-run the latest change through the pipeline after it's
      // been mutated so we're sure the latest state is fully deployed through.
      restartExecutionOnUpdate: true,
      /* ... */
    });

    // Configure the CodePipeline source - where your CDK App's source code is hosted
    const sourceOutput = new codepipeline.Artifact();
    const oauth = cdk.SecretValue.secretsManager('github-token');
    const source = new codepipeline_actions.GitHubSourceAction({
    actionName: 'GitHub',
    output: sourceOutput,
    repo: 'xflags',
    owner: 'kneekey23',
    oauthToken: oauth
    });
    pipeline.addStage({
    stageName: 'source',
    actions: [source],
    });

    const project = new codebuild.PipelineProject(pipelineStack, 'CodeBuild', {
        
        // * Choose an environment configuration that meets your use case.
        // * For NodeJS, this might be:
        // *
        environment: {
            buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
        },
        
      });

    const synthesizedApp = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
    actionName: 'CodeBuild',
    project,
    input: sourceOutput,
    outputs: [synthesizedApp],
    });
    pipeline.addStage({
    stageName: 'build',
    actions: [buildAction],
    });



    // Now add our service stacks
    const deployStage = pipeline.addStage({ stageName: 'Deploy' });
    const xflagsContainers = new XflagsContainersStack(this, 'XflagsContainersStack');
    // Add actions to deploy the stacks in the deploy stage:
    const deployServiceAAction = new cicd.PipelineDeployStackAction({
    stack: xflagsContainers,
    input: synthesizedApp,
    // See the note below for details about this option.
    adminPermissions: true,
    });
    deployStage.addAction(deployServiceAAction);
    // Add the necessary permissions for you service deploy action. This role is
    // is passed to CloudFormation and needs the permissions necessary to deploy
    // stack. Alternatively you can enable [Administrator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_job-functions.html#jf_administrator) permissions above,
    // users should understand the privileged nature of this role.


  }
}