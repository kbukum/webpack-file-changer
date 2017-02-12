import WebpackUtility from "../util/WebpackUtility";

export interface WebpackPlugin {
    apply(compiler, params);
    done(compiler, compilation, params);
}

export interface FromTo {
    from: string
    to : string,
    before?: (stats, fromTo: FromTo) => void,
    after?: (stats, fromTo: FromTo) => void,
    parameters?: {
        [key: string]: string
    }
}

export interface Change {
    file: string,
    before: (stats, change: Change) => void,
    after: (stats, change: Change) => void,
    parameters: {
        [key: string]: string
    }
}

export default class FileChanger implements WebpackPlugin {
    options: {
        move: FromTo[],
        change: Change[],
        complete: (stats) => void
    };
    constructor(options) {
        if(!options) {
            options = {};
        }
        if(!options.move) {
            options.move = [];
        }
        if(!options.change) {
            options.change = [];
        }
        this.options = options;
        this.apply = this.apply.bind(this);
        this.done = this.done.bind(this);
    }

    public apply(compiler) {
        compiler.plugin('done', this.done);
    }
    public done(stats, options) {
        for(let i = 0; i < this.options.move.length; i++) {
            let move: FromTo = this.options.move[i];
            WebpackUtility.moveFile(stats, move);
        }
        if(this.options.change) {
            for(let i = 0 ; i < this.options.change.length; i ++) {
                let change = this.options.change[i];
                if(change.before) {
                    change.before(stats, change);
                }
                change.file = WebpackUtility.normalizePath(stats, change.file);
                WebpackUtility.replaceInFile(stats, change.file, change.parameters);
                if(change.after) {
                    change.after(stats, change);
                }
            }
        }
        if(this.options.complete) {
            this.options.complete(stats);
        }
    }
}


