import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import XflagsPhotos = require('../lib/xflags_photos-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new XflagsPhotos.XflagsPhotosStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});