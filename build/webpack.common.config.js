const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
      StateStore: "./src/index.ts",
      Demo: "./src/demo.ts"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(process.cwd(), "dist")
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/assets/index.html",
        chunks: ["Demo"]
      })
    ]
  };
