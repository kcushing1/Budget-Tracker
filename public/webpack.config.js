const path = require("path");

const config = {
  context: __dirname + "/src",
  entry: "./assets/js/index.js",
  output: {
    path: __dirname + "./dist",
    filename: "bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};

module.exports = config;
