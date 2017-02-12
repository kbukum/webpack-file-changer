import * as index from "webpack-file-changer";

describe("index", () => {
    it("defined", () => {
        expect(index).toBeDefined();
        expect(typeof index).toEqual("function");
        expect((index as any).name).toEqual("FileChanger");
    })
});
