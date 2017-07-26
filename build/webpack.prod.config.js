const prodUglifyConfig = require("./webpack.prod.uglify.config");

module.exports = {
  devtool: "source-map",
  plugins: [
	  prodUglifyConfig
  ]
};