#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkAsyncTestStack } from '../lib/CdkAsyncTestStack';

const app = new cdk.App();
new CdkAsyncTestStack(app, 'CdkAsyncTestStack')