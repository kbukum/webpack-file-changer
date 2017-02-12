"use strict";
var index = require("webpack-file-changer");
describe("index", function () {
    it("defined", function () {
        expect(index).toBeDefined();
        expect(typeof index).toEqual("function");
        expect(index.name).toEqual("FileChanger");
    });
});
//# sourceMappingURL=index.spec.js.map