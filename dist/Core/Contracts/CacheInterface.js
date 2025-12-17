'use strict';
/**
 * 缓存接口
 */
class CacheInterface {
    /**
     * 获取缓存
     * @param key 缓存名
     * @returns
     */
    async get(key) { return null; }
    /**
     * 设置缓存
     * @param key 缓存名
     * @returns
     */
    async has(key) { return false; }
    /**
     * 设置缓存
     * @param key 缓存名
     * @param data 数据
     * @param lifetime 过期时间，单位：秒
     * @returns
     */
    async set(key, data = null, lifetime = 0) { return false; }
    /**
     * 删除缓存
     * @param key 缓存名
     * @returns
     */
    async delete(key) { return false; }
}
;
module.exports = CacheInterface;
