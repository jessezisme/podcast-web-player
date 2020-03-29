const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (ENV, ARGV) => {
  return {
    entry: ['./src/js/main.js', './src/style/style.scss'],
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'bundle.js'
    },
    // watch: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 1000
    },
    stats: 'errors-only',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          // exclude: /node_modules/,
          exclude: (file) => /node_modules/.test(file) && !/\.vue\.js/.test(file),
          use: {
            loader: 'babel-loader'
            // options: {
            // babelrc: false,
            // presets: ["@babel/preset-env"]
            // }
          }
        },
        {
          test: /style\.scss$/i,
          include: [path.resolve(__dirname, 'src/style')],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '../style/[name].css'
              }
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                injectType: 'linkTag'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: (loader) => [require('autoprefixer'), require('cssnano')({ preset: 'default' })],
                minimize: ARGV.mode === 'development' ? true : false
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /(\.s[ac])|(\.css)$/i,
          include: [path.resolve(__dirname, 'src')],
          exclude: [path.resolve(__dirname, 'src/style/style.scss')],
          use: [
            {
              loader: 'vue-style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                sourcemaps: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: true,
                plugins: (loader) => [require('autoprefixer'), require('cssnano')({ preset: 'default' })],
                minimize: ARGV.mode === 'development' ? true : false
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CopyPlugin([
        {
          from: path.resolve(__dirname, './src/assets'),
          to: path.resolve(__dirname, './dist/assets')
        },
        {
          from: path.resolve(__dirname, './src/fonts'),
          to: path.resolve(__dirname, './dist/fonts')
        }
      ])
    ]
  };
};
