const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = new UglifyJsPlugin({
	sourceMap: true,
	compress: {
		warnings: true,
		drop_console: true, // drop console.* calls
		unused: true, // drop unref'd vars/funcs
		dead_code: true, // drop unreachable code
		screw_ie8: false,
	},
	mangle: {
		screw_ie8: false,
	},
	output: {
		screw_ie8: false
	}
});
