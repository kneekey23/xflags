import cdk = require('@aws-cdk/core');
import sqs = require('@aws-cdk/aws-sqs');
import { Duration } from '@aws-cdk/core';


export class XflagsSpecialeventsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    let queue = new sqs.Queue(this, 'SpecialEventQueue', {
      queueName: 'xflags-special-events.fifo',
      visibilityTimeout: Duration.minutes(6),
      fifo: true,
      contentBasedDeduplication: true
    })

  }
}
