import * as path from "path";
import * as fs from "fs-extra";

/**
 *
 */
export default class Files {
    /**
     *
     * @param file
     * @return {boolean}
     */
    public static isExist(file){
        return fs.existsSync(file);
    }

    public static isFile(filePath: string): boolean {
        return fs.lstatSync(filePath).isFile();
    }

    public static replaceInFile(filePath, toReplaces: any[], replacements: any[]){
        let content = fs.readFileSync(filePath, 'utf8');
        for(let i = 0 ; i < toReplaces.length; i++ ) {
            let toReplace = toReplaces[i];
            let replacement = replacements[i];
            let replacer = (match) => {
                console.log('Replacing in %s: %s => %s', filePath, match, replacement);
                return replacement
            };
            if(typeof toReplace === "string") {
                toReplace = new RegExp(toReplace, 'g');
            }
            content = content.replace(toReplace, replacer);
        }
        fs.writeFileSync(filePath, content);
    }
    /**
     * Look ma, it's cp -R.
     * @param {string} src The path to the thing to copy.
     * @param {string} dest The path to the new copy.
     */
    public static copy = function(src, dest) {
        let exists = fs.existsSync(src);
        let stats = exists && fs.statSync(src);
        let isDirectory = exists && stats.isDirectory();
        if (exists && isDirectory) {
            fs.mkdirSync(dest);
            fs.readdirSync(src).forEach(function(childItemName) {
                Files.copy(path.join(src, childItemName),
                    path.join(dest, childItemName));
            });
        } else {
            fs.linkSync(src, dest);
        }
    };
}
