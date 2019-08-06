const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'none',
    entry: './decorator.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js[x]?/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'template.ejs')
        })
    ],
    devtool: 'source-map'
}
