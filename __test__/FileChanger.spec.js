"use strict";
var webpack = require("webpack");
var path = require("path");
var FileChanger_1 = require("webpack-file-changer/lib/api/FileChanger");
var rimraf = require("rimraf");
var WebpackConfig = require("./filechanger.test/webpack.test");
var fs = require("fs");
var rootFolder = path.resolve(__dirname, "filechanger.test");
var outFolder = path.resolve(rootFolder, "out");
describe("index", function () {
    it("constructor", function () {
    });
    it("apply", function (done) {
        var isCalled = false;
        var fileChanger = new FileChanger_1.default({
            move: [{
                    from: path.resolve(rootFolder, './assets', 'index.html'),
                    to: './index.html',
                    parameters: {
                        'app\\.min\\.js': 'app.0.[renderedHash:0].min.js'
                    },
                    before: function (stats, move) {
                        console.log("before moving");
                    },
                    after: function (stats, move) {
                        console.log("after moved");
                    }
                }],
            complete: function (stats) {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            }
        });
        var webpackConfig = new WebpackConfig();
        webpackConfig.plugins.push(fileChanger);
        webpack(webpackConfig, function () {
            rimraf(outFolder, fs, function () {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            });
        });
    });
    it("apply-chunks", function (done) {
        var isCalled = false;
        var fileChanger = new FileChanger_1.default({
            move: [{
                    from: path.resolve(rootFolder, './assets', 'index.html'),
                    to: './index.html',
                    parameters: {
                        "app\\.min\\.js": 'app.0.[renderedHash:0].min.js',
                        "app2\\.min\\.js": 'app2.0.[renderedHash:1].min.js'
                    },
                    before: function (stats, move) {
                        console.log("before moving");
                    },
                    after: function (stats, move) {
                        console.log("after moved");
                    }
                }],
            change: [
                {
                    file: './index.html',
                    parameters: {
                        "app\\.min\\.js": 'app.0.[renderedHash:0].min.js',
                        "app2\\.min\\.js": 'app2.0.[renderedHash:1].min.js'
                    },
                    before: function (stats, move) {
                        console.log("before replacing...");
                    },
                    after: function (stats, move) {
                        console.log("after replacing...");
                    }
                }
            ],
            complete: function () {
                if (isCalled) {
                    done();
                }
                isCalled = true;
            }
        });
        var webpackConfig = new WebpackConfig();
        webpackConfig.entry["app2"] = "./index2";
        webpackConfig.plugins.push(fileChanger);
        webpack(webpackConfig, function () {
            done();
        });
    });
});
//# sourceMappingURL=FileChanger.spec.js.map