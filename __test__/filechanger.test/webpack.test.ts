import * as path from "path";
import * as webpack from "webpack";
import FileChanger from "webpack-file-changer/lib/api/FileChanger";

const WebpackConfiguration = function () {
    const app = path.resolve(__dirname, "src");
    const out = path.resolve(__dirname, "out");
    const node_modules = path.resolve(__dirname, "../../node_modules");
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

module.exports =  WebpackConfiguration;
