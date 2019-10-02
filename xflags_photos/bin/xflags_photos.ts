#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { XflagsPhotosStack } from '../lib/xflags_photos-stack';

const app = new cdk.App();
new XflagsPhotosStack(app, 'XflagsPhotosStack');
