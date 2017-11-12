const path = require('path');
const glob = require('glob');


const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer'); 


module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/,
                loader: "babel-loader" 
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('autoprefixer')
                                ]
                            }
                        },
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('../style/style.css')
    ]


};