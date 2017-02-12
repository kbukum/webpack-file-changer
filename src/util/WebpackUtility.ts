import {FromTo} from "../api/FileChanger";
import * as path from "path";
import * as fsExtra from "fs-extra";
import Strings from "./Strings";
import Files from "./Files";


export default class WebpackUtility {
    static hashPattern = /\[hash\]/;
    static hashAndIdPattern = /\[(hash)\:([0-9]*)\]/;
    static renderedHashAndIdPattern = /\[(renderedHash)\:([0-9]*)\]/;

    static moveFile(stats: any, move: FromTo) {
        move.to = WebpackUtility.normalizePath(stats, move.to);
        if(move.before) {
            move.before(stats, move);
        }
        fsExtra.copySync(move.from, move.to);
        if(Files.isFile(move.to)) {
            WebpackUtility.replaceInFile(stats, move.to, move.parameters);
        }
        if(move.after) {
            move.after(stats, move);
        }
    }

    static getParameters(stats: any, parameters: {[key: string]: string}) {
        if(parameters) {
            for(let key in parameters) {
                if(parameters.hasOwnProperty(key)) {
                    let value = parameters[key];
                    if(typeof value === "string") {
                        let hashResult = value.match(WebpackUtility.hashPattern);
                        if(hashResult != null) {
                            value = value.replace(WebpackUtility.hashPattern, stats.hash);
                        }
                        let hasIdResult = value.match(WebpackUtility.hashAndIdPattern);
                        if(hasIdResult != null) {
                            value = value.replace(WebpackUtility.hashAndIdPattern, stats.compilation.chunks[hasIdResult[2]].hash);
                        }
                        let renderedHashIdResult = value.match(WebpackUtility.renderedHashAndIdPattern);
                        if(renderedHashIdResult != null) {
                            value = value.replace(WebpackUtility.renderedHashAndIdPattern, stats.compilation.chunks[renderedHashIdResult[2]].renderedHash);
                        }
                    }
                    parameters[key] = value;
                }
            }
        }
        return parameters;
    }

    static replaceHash(value, hash) {
        let hashResult = value.match(WebpackUtility.hashPattern);
        if(hashResult != null) {
            return value.replace(WebpackUtility.hashPattern, hash);
        }
        return value;
    }
    static replaceHashById(value, hash) {
        let hashResult = value.match(WebpackUtility.hashPattern);
        if(hashResult != null) {
            return value.replace(WebpackUtility.hashPattern, hash);
        }
        return value;
    }

    static replaceInFile(stats: any, filePath: string, parameters: {[key: string]: string}) {
        let toReplaces = [];
        let replacements = [];
        parameters = WebpackUtility.getParameters(stats, parameters);
        for(let key in parameters) {
            if(parameters.hasOwnProperty(key)) {
                toReplaces.push(key);
                replacements.push(parameters[key]);
            }
        }
        Files.replaceInFile(filePath, toReplaces, replacements);
    }

    static normalizePath(stats, filePath){
        let outputPath = stats.compilation.outputOptions.path;
        if(Strings.startsWith(filePath, "./")) {
            filePath = path.resolve(outputPath, filePath)
        }
        return filePath;
    }
}