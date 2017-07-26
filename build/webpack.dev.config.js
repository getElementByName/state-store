const path = require("path");

module.exports = {
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.join(process.cwd(), "dist"),
    host: "0.0.0.0",
    port: 8080,
    inline: true
  }
};
