import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import sqs = require('@aws-cdk/aws-sqs');
import s3N = require('@aws-cdk/aws-s3-notifications');
import dynamo = require('@aws-cdk/aws-dynamodb');
import ssm = require('@aws-cdk/aws-ssm');

export class XflagsPhotosStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    let bucket = new s3.Bucket(this, 'bucket');
    
    let queue = new sqs.Queue(this, 'queue');

    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3N.SqsDestination(queue));

    let table = new dynamo.Table(this, 'table', {
      partitionKey: {
        name: 'MessageId',
        type: dynamo.AttributeType.STRING
      }
    })

    let tableParam = new ssm.StringParameter(this, 'tableParam', {
      stringValue: table.tableName
    })

    let queueParam = new ssm.StringParameter(this, 'queueParam', {
      stringValue: queue.queueUrl
    })

  }
}
