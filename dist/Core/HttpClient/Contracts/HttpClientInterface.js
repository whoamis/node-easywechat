'use strict';
class HttpClientInterface {
    /**
     * 获取axios实例
     * @returns
     */
    getInstance() { return null; }
    /**
     * 设置axios实例
     */
    setInstance(instance) { return this; }
    /**
     * 设置日志方法
     */
    setLogger(logger) { return this; }
    /**
     * 设置错误判断方法
     * @param closure
     * @returns
     */
    judgeFailureUsing(closure) { return this; }
    /**
     * 发起http请求
     */
    async request(method, url, payload) { return null; }
}
;
module.exports = HttpClientInterface;
