#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { XFlagsPipelineStack } from '../lib/xflags_pipeline-stack';
import { XflagsContainersStack } from '../lib/xflags_containers-stack';

const app = new cdk.App();
//new XFlagsPipelineStack(app, 'XflagsPipelineStack');
new XflagsContainersStack(app, 'XflagsContainersStack');








