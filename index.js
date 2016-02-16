import * as utils from './lib/utils';
import * as async from './lib/async';

const kit = {
    ...utils,
    ...async
};

// Note: unable to use 'export default' with webpack, due to webpack's bug
// reference: https://github.com/webpack/webpack/issues/706#issuecomment-180429684
module.exports = kit;
