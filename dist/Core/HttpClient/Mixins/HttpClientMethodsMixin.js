'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HttpClientInterface_1 = __importDefault(require("../Contracts/HttpClientInterface"));
const merge_1 = __importDefault(require("merge"));
class HttpClientMethodsMixin extends HttpClientInterface_1.default {
    /**
     * 发送get请求
     * @param url 请求地址
     * @param payload axios配置项
     * @returns
     */
    async get(url, payload = {}) {
        return this.request('get', url, payload);
    }
    /**
     * 发送post请求
     * @param url 请求地址
     * @param payload axios配置项
     * @returns
     */
    async post(url, payload = {}) {
        return this.request('post', url, payload);
    }
    /**
     * 发送patch请求
     * @param url 请求地址
     * @param payload axios配置项
     * @returns
     */
    async patch(url, payload = {}) {
        return this.request('patch', url, payload);
    }
    /**
     * 发送put请求
     * @param url
     * @param payload axios配置项
     * @returns
     */
    async put(url, payload = {}) {
        return this.request('put', url, payload);
    }
    /**
     * 发送delete请求
     * @param url
     * @param payload axios配置项
     * @returns
     */
    async delete(url, payload = {}) {
        return this.request('delete', url, payload);
    }
    /**
     * 发送post请求（JSON数据）
     * @param url 请求地址
     * @param data JSON对象
     * @param payload axios配置项
     * @returns
     */
    async postJson(url, data, payload = {}) {
        if (!payload)
            payload = {};
        if (!payload['headers'])
            payload['headers'] = {};
        payload['headers']['Content-Type'] = 'application/json';
        payload.json = merge_1.default.recursive({}, data);
        return this.request('post', url, payload);
    }
    /**
     * 发送patch请求（JSON数据）
     * @param url 请求地址
     * @param data JSON 对象
     * @param payload axios配置项
     * @returns
     */
    async patchJson(url, data, payload = {}) {
        if (!payload)
            payload = {};
        if (!payload['headers'])
            payload['headers'] = {};
        payload['headers']['Content-Type'] = 'application/json';
        payload.json = merge_1.default.recursive({}, data);
        return this.request('patch', url, payload);
    }
    /**
     * 发送post请求（XML数据）
     * @param url 请求地址
     * @param data XML字符串 或 键值对
     * @param payload axios配置项
     * @returns
     */
    async postXml(url, data, payload = {}) {
        if (!payload)
            payload = {};
        if (!payload['headers'])
            payload['headers'] = {};
        payload['headers']['Content-Type'] = 'text/xml';
        payload.xml = typeof data === 'object' ? merge_1.default.recursive({}, data) : data;
        return this.request('post', url, payload);
    }
}
module.exports = HttpClientMethodsMixin;
