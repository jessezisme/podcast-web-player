const path = require("path");
const glob = require("glob");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js"
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: ["env"]
          }
        }
      },
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, "src")],
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: loader => [require("autoprefixer")]
            }
          },
          "sass-loader"
        ]
      }
    ]
  },
  // plugins: [new VueLoaderPlugin(), new ExtractTextPlugin("../style/style.css"), new MinifyPlugin()]
  plugins: [new VueLoaderPlugin(), new MinifyPlugin()]

};
