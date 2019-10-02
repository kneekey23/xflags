import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

export class XflagsContainersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
   


    let vpc = new ec2.Vpc(this, 'vpc');

    let cluster = new ecs.Cluster(this, 'Cluster', {vpc});

    let service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'XFlagsNodeJsApp', {
      memoryLimitMiB: 512,
      cpu: 256,
      enableLogging: true,
      image: ecs.AssetImage.fromAsset('nodejsapp')
    })




  }
}
