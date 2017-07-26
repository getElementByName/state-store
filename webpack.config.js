const merge = require("webpack-merge");

const webpackCommonConfig = require("./build/webpack.common.config");
const webpackDevConfig = require("./build/webpack.dev.config");
const webpackProdConfig = require("./build/webpack.prod.config");
const webpackTsConfig = require("./build/webpack.ts.config");

module.exports = function(env) {
  const isDevMode = env && env.dev;

  return merge(webpackCommonConfig, isDevMode ? webpackDevConfig : webpackProdConfig, webpackTsConfig);
};
