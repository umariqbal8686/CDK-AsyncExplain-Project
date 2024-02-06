# Welcome to CDK async explain TypeScript project:

This code sets up a VPC, an EC2 instance within that VPC, monitors its CPU utilization using CloudWatch, and sends notifications to an SNS topic when the CPU utilization crosses a specified threshold.

## Code definitions:

let's break down each part of the provided code:

VPC Definition:

const vpc = new ec2.Vpc(this, 'LabVpc', {
  vpcName: 'MyLabVPC',
  maxAzs: 2 // Max availability zones
});

This part defines a Virtual Private Cloud (VPC) in Amazon EC2.
It specifies the VPC name as "MyLabVPC" and sets the maximum availability zones to 2.
EC2 Instance Definition:


const instance = new ec2.Instance(this, 'MyInstance', {
  instanceName: 'TestLinux01',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
  machineImage: new ec2.AmazonLinuxImage(),
  vpc: vpc,
});

This part defines an EC2 instance within the previously defined VPC.
It specifies the instance name as "TestLinux01", the instance type as T2 Micro, and the machine image as the latest Amazon Linux image.
The instance is placed within the previously defined VPC (vpc).
CloudWatch Metric Creation:


const cpuUtilizationMetric = new cloudwatch.Metric({
  namespace: 'AWS/EC2',
  metricName: 'CPUUtilization',
  dimensionsMap: {
    InstanceId: instanceId,
  },
  period: cdk.Duration.minutes(5),
});

This part creates a CloudWatch metric for monitoring CPU utilization of the EC2 instance.
It specifies the namespace as "AWS/EC2", the metric name as "CPUUtilization", and the dimensions as the instance ID.
The period is set to 5 minutes.
CloudWatch Alarm Creation:


const basicMonitoring = new cloudwatch.Alarm(this, 'BasicMonitoringAlarm', {
  metric: cpuUtilizationMetric,
  threshold: 80,
  evaluationPeriods: 1,
  alarmName: 'BasicMonitoringAlarm',
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD
});

This part defines a CloudWatch alarm for basic monitoring of the EC2 instance.
It uses the previously created CPU utilization metric, sets the threshold to 80%, and defines the evaluation period as 1.
The alarm name is set as "BasicMonitoringAlarm", and it triggers when the CPU utilization is greater than or equal to the threshold.
SNS Topic and Alarm Action Addition:


const snsTopic = new sns.Topic(this, 'MySnsTopic', {
  topicName: 'TeseEC2Alert'
});

basicMonitoring.addAlarmAction(new cloudwatchActions.SnsAction(snsTopic));

This part creates an SNS topic with the name "TeseEC2Alert".
It adds an action to the CloudWatch alarm (basicMonitoring) to send notifications to the SNS topic whenever the alarm is triggered.

Async Operation Handling:
The code wraps the operations in an asynchronous function and uses async/await for handling asynchronous tasks.
This ensures that operations like instance creation and CloudWatch alarm setup, which might take time, are properly awaited and handled.
