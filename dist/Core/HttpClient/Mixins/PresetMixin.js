'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
class PresetMixin {
    constructor() {
        /**
         * 存储预置参数
         */
        this.presets = {};
        /**
         * 存储预置headers数据
         */
        this.prependHeaders = {};
        /**
         * 存储预置数据
         */
        this.prependData = {};
        /**
         * 存储预置文件数据
         */
        this.prependFiles = {};
    }
    /**
     * 设置预置参数
     * @param presets
     * @returns
     */
    setPresets(presets) {
        this.presets = presets;
        return this;
    }
    /**
     * 设置单个预置header
     * @param key
     * @param value
     * @returns
     */
    withHeader(key, value) {
        if (typeof this.prependHeaders !== 'object') {
            this.prependHeaders = {};
        }
        this.prependHeaders[key] = value;
        return this;
    }
    /**
     * 批量设置预置headers
     * @param headers
     * @returns
     */
    withHeaders(headers) {
        headers.map((value, key) => {
            this.withHeader(key, value);
        });
        return this;
    }
    /**
     * 设置预置数据
     * @param key 参数名
     * @param value 参数值，不设置则尝试从预置参数中获取
     * @returns
     */
    with(key, value = null) {
        if (Array.isArray(key)) {
            key.map((k) => {
                this.with(k, this.presets[k] ?? null);
            });
            return this;
        }
        else if (typeof key === 'object') {
            key.map((v, k) => {
                this.with(k, v ?? this.presets[k] ?? null);
            });
            return this;
        }
        if (typeof this.prependData !== 'object') {
            this.prependData = {};
        }
        this.prependData[key] = value || this.presets[key] || null;
        return this;
    }
    /**
     * 预设置app_id（因nodejs不支持魔术方法，只好预先设置几个常用的方法）
     * @param new_appid
     * @returns
     */
    withAppId(new_appid = null) {
        this.with('app_id', new_appid);
        return this;
    }
    /**
     * 预设置app_id的别名（因nodejs不支持魔术方法，只好预先设置几个常用的方法）
     * @param new_alias
     * @returns
     */
    withAppIdAs(new_alias) {
        this.with(new_alias, this.presets['app_id']);
        return this;
    }
    /**
     * 预设置secret（因nodejs不支持魔术方法，只好预先设置几个常用的方法）
     * @param new_secret
     * @returns
     */
    withSecret(new_secret = null) {
        this.with('secret', new_secret);
        return this;
    }
    /**
     * 预设置文件
     * @param file  文件路径或可读文件流
     * @param key 参数名，默认：'file'
     * @returns
     */
    withFile(file, key = 'file') {
        if (typeof this.prependFiles !== 'object') {
            this.prependFiles = {};
        }
        if (file instanceof fs_1.default.ReadStream) {
            this.prependFiles[key] = file;
        }
        else if (typeof file === 'string') {
            this.prependFiles[key] = fs_1.default.createReadStream(file);
        }
        return this;
    }
    /**
     * 预设置多个文件
     * @param files  键名：文件名，键值：文件路径或可读文件流
     * @returns
     */
    withFiles(files) {
        for (const key in files) {
            this.withFile(files[key], key);
        }
        return this;
    }
    /**
     * 合并预置参数并清空预置数据
     * @param payload
     * @param method
     * @returns
     */
    mergeThenResetPrepends(payload, method = 'get') {
        let field = method.toLowerCase() === 'get' ? 'params' : 'data';
        let options = { ...payload };
        if (!options.headers)
            options.headers = {};
        if (!options.formData)
            options.formData = {};
        if ((options.headers['Content-Type'] ?? options.headers['content-type'] ?? null) === 'application/json' || !!options.json) {
            field = 'json';
        }
        if ((options.headers['Content-Type'] ?? options.headers['content-type'] ?? null) === 'text/xml' || !!options.xml) {
            field = 'xml';
        }
        if (this.prependData && Object.keys(this.prependData).length > 0) {
            options[field] = { ...this.prependData, ...options[field] };
        }
        if (this.prependHeaders && Object.keys(this.prependHeaders).length > 0) {
            options.headers = { ...this.prependHeaders, ...options.headers };
        }
        if (this.prependFiles && Object.keys(this.prependFiles).length > 0) {
            options.formData = { ...this.prependFiles, ...options.formData };
        }
        this.prependData = {};
        this.prependHeaders = {};
        this.prependFiles = {};
        return options;
    }
}
module.exports = PresetMixin;
