import * as utils from './lib/utils';

const kit = {
    ...utils,
};

// Note: unable to use 'export default' with webpack, due to webpack's bug
// reference: https://github.com/webpack/webpack/issues/706#issuecomment-180429684
module.exports = kit;
