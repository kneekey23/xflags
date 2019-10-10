#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { XflagsSpecialeventsStack } from '../lib/xflags_specialevents-stack';

const app = new cdk.App();
new XflagsSpecialeventsStack(app, 'XflagsSpecialeventsStack');
