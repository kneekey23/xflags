import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import XflagsContainers = require('../lib/xflags_containers-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new XflagsContainers.XflagsContainersStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});