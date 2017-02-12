import * as webpack from "webpack";
import * as path from "path";
import FileChanger from "webpack-file-changer/lib/api/FileChanger";
const rimraf = require("rimraf");
const WebpackConfig = require("./filechanger.test/webpack.test");
const fs = require("fs");
let rootFolder = path.resolve(__dirname, "filechanger.test");
let outFolder = path.resolve(rootFolder, "out");
describe("index", () => {
    it("constructor", () => {

    });
    it("apply", (done) => {
        let isCalled = false;
        const fileChanger = new FileChanger({
            move: [{
                from: path.resolve(rootFolder, './assets', 'index.html'),
                to: './index.html',
                parameters: {
                    'app\\.min\\.js': 'app.0.[renderedHash:0].min.js'
                },
                before: (stats, move) => {
                    console.log("before moving");
                },
                after: (stats, move) => {
                    console.log("after moved")
                }
            }],
            complete: (stats) => {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            }
        });
        const webpackConfig: any = new WebpackConfig();
        webpackConfig.plugins.push(fileChanger);
        webpack(webpackConfig, function () {
            rimraf(outFolder, fs, () => {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            });
        });
    });

    it("apply-chunks", (done) => {
        let isCalled = false;
        const fileChanger = new FileChanger({
            move: [{
                from: path.resolve(rootFolder, './assets', 'index.html'),
                to: './index.html',
                parameters: {
                    "app\\.min\\.js": 'app.0.[renderedHash:0].min.js',
                    "app2\\.min\\.js": 'app2.0.[renderedHash:1].min.js'
                },
                before: (stats, move) => {
                    console.log("before moving");
                },
                after: (stats, move) => {
                    console.log("after moved")
                }
            }],
            change: [
                {
                    file: './index.html',
                    parameters: {
                        "app\\.min\\.js": 'app.0.[renderedHash:0].min.js',
                        "app2\\.min\\.js": 'app2.0.[renderedHash:1].min.js'
                    },
                    before: (stats, move) => {
                        console.log("before replacing...");
                    },
                    after: (stats, move) => {
                        console.log("after replacing...")
                    }
                }
            ],
            complete: () => {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            }
        });

        const webpackConfig: any = new WebpackConfig();
        webpackConfig.entry["app2"] = "./index2";
        webpackConfig.plugins.push(fileChanger);
        webpack(webpackConfig, function () {
            done();
        });
    });
});

