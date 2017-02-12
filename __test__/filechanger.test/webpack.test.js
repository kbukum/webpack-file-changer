"use strict";
var path = require("path");
var WebpackConfiguration = function () {
    var app = path.resolve(__dirname, "src");
    var out = path.resolve(__dirname, "out");
    var node_modules = path.resolve(__dirname, "../../node_modules");
    return {
        context: app,
        entry: {
            app: "./index"
        },
        output: {
            path: out,
            filename: "[name].[id].[hash].js",
            chunkFilename: "[id].bundle.js"
        },
        resolve: {
            modules: [
                app,
                node_modules
            ],
            enforceModuleExtension: false,
            extensions: [".webpack.js", ".web.js", ".js", ".json"],
            alias: {}
        },
        target: "node",
        plugins: []
    };
};
module.exports = WebpackConfiguration;
//# sourceMappingURL=webpack.test.js.map