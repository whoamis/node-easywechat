'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const merge_1 = __importDefault(require("merge"));
const Utils_1 = require("../Support/Utils");
class FileCache {
    constructor(options = null) {
        this.options = {
            path: './',
            dirMode: 0o777,
            fileMode: 0o666,
            ext: '.cache'
        };
        if (options && typeof options == 'object') {
            this.options = (0, merge_1.default)({
                path: './',
                dirMode: 0o777,
                fileMode: 0o666,
                ext: '.cache'
            }, options);
        }
        this.options.path = path_1.default.resolve(this.options.path) + '/';
        try {
            fs_1.default.accessSync(this.options.path, fs_1.default.constants.R_OK & fs_1.default.constants.W_OK);
        }
        catch (e) {
            try {
                fs_1.default.mkdirSync(this.options.path, this.options.dirMode);
            }
            catch (e) {
                throw new Error(`The path '${this.options.path}' can not be write.`);
            }
        }
    }
    getCacheFile(id) {
        return this.options.path + id + this.options.ext;
    }
    getCacheContent(file) {
        let dataItem = JSON.parse(fs_1.default.readFileSync(file, {
            encoding: 'utf-8',
            flag: 'r'
        }));
        if (dataItem.lifeTime > 0 && dataItem.lifeTime < (0, Utils_1.getTimestamp)()) {
            throw new Error('Cache expired.');
        }
        return dataItem.data;
    }
    async get(id) {
        let content = null;
        try {
            let file = this.getCacheFile(id);
            content = this.getCacheContent(file);
        }
        catch (e) {
            content = null;
        }
        return content;
    }
    async has(id) {
        try {
            let file = this.getCacheFile(id);
            fs_1.default.accessSync(file, fs_1.default.constants.R_OK & fs_1.default.constants.W_OK);
            let content = this.getCacheContent(file);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    async set(id, data = null, lifeTime = 0) {
        let file = this.getCacheFile(id);
        try {
            let dataItem = {
                data,
                lifeTime: lifeTime > 0 ? lifeTime + (0, Utils_1.getTimestamp)() : 0
            };
            fs_1.default.writeFileSync(file, JSON.stringify(dataItem), {
                mode: this.options.fileMode,
                encoding: 'utf-8',
                flag: 'w'
            });
        }
        catch (e) {
            return false;
        }
        return true;
    }
    async delete(id) {
        let file = this.getCacheFile(id);
        try {
            fs_1.default.unlinkSync(file);
        }
        catch (e) {
            return false;
        }
        return true;
    }
}
;
module.exports = FileCache;
