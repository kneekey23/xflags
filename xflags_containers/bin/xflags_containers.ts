#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { XflagsContainersStack } from '../lib/xflags_containers-stack';

const app = new cdk.App();
new XflagsContainersStack(app, 'XflagsContainersStack');
