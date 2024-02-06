import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as sns from 'aws-cdk-lib/aws-sns'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import * as cloudwatchActions from 'aws-cdk-lib/aws-cloudwatch-actions'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkAsyncTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // Define a VPC
    const vpc = new ec2.Vpc(this, 'LabVpc', {
      vpcName: 'MyLabVPC',
      maxAzs: 2 // Max availability zones
    });

    // Define an EC2 instance
    const instance = new ec2.Instance(this, 'MyInstance', {
      instanceName: 'TestLinux01',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc: vpc,
    });

    // Asynchronously wait for the EC2 instance to be created
    const instanceId = instance.instanceId;

    // Handle the async operation using async/await
    (async () => {
      try {
        console.log('Instance created with ID:', instanceId);

        // Create a CloudWatch metric for CPU utilization
        const cpuUtilizationMetric = new cloudwatch.Metric({
          namespace: 'AWS/EC2',
          metricName: 'CPUUtilization',
          dimensionsMap: {
            InstanceId: instanceId,
          },
          period: cdk.Duration.minutes(5), // Optional: Adjust the period as needed
        });

        // Define basic monitoring for the EC2 instance
        const basicMonitoring = new cloudwatch.Alarm(this, 'BasicMonitoringAlarm', {
          metric: cpuUtilizationMetric,
          threshold: 80,
          evaluationPeriods: 1,
          alarmName: 'BasicMonitoringAlarm',
          comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD
        });

        // Create an SNS topic
        const snsTopic = new sns.Topic(this, 'MySnsTopic', {
          topicName: 'TeseEC2Alert'
        });

        // Add an action to the alarm to send notifications to the SNS topic
        basicMonitoring.addAlarmAction(new cloudwatchActions.SnsAction(snsTopic));

        console.log('CloudWatch alarm created for instance:', instanceId);
      } catch (error) {
        console.error('Error occurred while creating CloudWatch alarm:', error);
      }
    })();
  }
}

// Define an app and instantiate the stack
const app = new cdk.App();
new CdkAsyncTestStack(app, 'CdkAsyncTestStack');
