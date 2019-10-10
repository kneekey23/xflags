import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import XflagsSpecialevents = require('../lib/xflags_specialevents-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new XflagsSpecialevents.XflagsSpecialeventsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});