var webpack = require('webpack'),
    path = require('path');

module.exports = {
    entry: {
        bundle: [
            './index.js'
        ]    
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'kdutils.js',
        library: 'kdutils',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=stage-0&presets[]=es2015']
            }
        ]
    }
};
