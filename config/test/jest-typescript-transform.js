const tsc = require("typescript");
const conf = require("./../../tsconfig.json");
const compilerOptions = conf.compilerOptions;
module.exports = {
    process: function(src, path) {
        if (path.match(/\.(css|less|scss|styl|sss)$/)) {
            return "";
        } else if (path.match(/\.(t|j)sx?$/)) {
            return tsc.transpile(
                src,
                compilerOptions,
                path,
                []
            );
        }
        return src;
    }
};