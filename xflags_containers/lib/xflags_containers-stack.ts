import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

export class XflagsContainersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc = new ec2.Vpc(this, 'vpc');

    let cluster = new ecs.Cluster(this, 'Cluster', {vpc});

    let taskDefinition = new ecs.FargateTaskDefinition(this, 'fargateTaskDef')

    taskDefinition.addContainer('nodejsapp',{
      image: ecs.AssetImage.fromAsset('nodejsapp')
    }).addPortMappings({
      containerPort: 8080,
      hostPort:8080
    })
    

    let service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'XFlagsNodeJsApp', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskDefinition: taskDefinition
    })

  }
}
