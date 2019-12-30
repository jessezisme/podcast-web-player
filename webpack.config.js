const path = require("path");
const glob = require("glob");
const autoprefixer = require("autoprefixer");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js"
  },
  // plugins: [
  //       new webpack.ProvidePlugin({
  //         lazysizes: 'lazysizes',
  //       }),
  // ],
  watch: true,
  watchOptions: {
    ignored: /node_modules/
    // poll: 200
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // options: {
            // babelrc: false,
            // presets: ["@babel/preset-env"]
          // }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        include: [path.resolve(__dirname, "src")],
        use: [
          "vue-style-loader",
          "css-loader",
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
  plugins: [new VueLoaderPlugin()]
};
