'use strict';
const AES_1 = require("../Core/Support/AES");
const PrivateKey_1 = require("../Core/Support/PrivateKey");
const PublicKey_1 = require("../Core/Support/PublicKey");
class Merchant {
    constructor(mchId, privateKey, certificate, secretKey, v2SecretKey, platformCerts = [], app = null) {
        this.mchId = mchId;
        this.secretKey = secretKey;
        this.v2SecretKey = v2SecretKey;
        this.app = app;
        this.isConfigPlatformCerts = false;
        this.platformCerts = {};
        if (!(privateKey instanceof PrivateKey_1.PrivateKey)) {
            this.privateKey = new PrivateKey_1.PrivateKey(privateKey);
        }
        else {
            this.privateKey = privateKey;
        }
        if (!(certificate instanceof PublicKey_1.PublicKey)) {
            this.certificate = new PublicKey_1.PublicKey(certificate);
        }
        else {
            this.certificate = certificate;
        }
        this.platformCerts = this.normalizePlatformCerts(platformCerts);
    }
    /**
     * 统一规范化平台证书
     * @param platformCerts 平台证书列表
     * @returns
     */
    normalizePlatformCerts(platformCerts) {
        let certs = {};
        let isArray = Array.isArray(platformCerts);
        for (let key in platformCerts) {
            let publicKey = platformCerts[key];
            if (typeof publicKey === 'string') {
                publicKey = new PublicKey_1.PublicKey(publicKey);
            }
            if (!(publicKey instanceof PublicKey_1.PublicKey)) {
                throw new Error('Invalid platform certficate.');
            }
            certs[isArray ? publicKey.getSerialNo() : key] = publicKey;
        }
        if (Object.keys(certs).length > 0) {
            this.isConfigPlatformCerts = true;
        }
        return certs;
    }
    getMerchantId() {
        return this.mchId;
    }
    getPrivateKey() {
        return this.privateKey;
    }
    getSecretKey() {
        return this.secretKey;
    }
    getV2SecretKey() {
        return this.v2SecretKey;
    }
    getCertificate() {
        return this.certificate;
    }
    async getPlatformCert(serial) {
        if (!this.isConfigPlatformCerts) {
            // 如果不是通过配置文件设置的平台证书，则每次都从缓存或者接口获取证书
            let certs = await this.loadPlatformCerts();
            this.setPlatformCerts(certs);
        }
        return this.platformCerts[serial] ?? null;
    }
    async getPlatformCerts() {
        if (!this.isConfigPlatformCerts) {
            // 如果不是通过配置文件设置的平台证书，则每次都从缓存或者接口获取证书
            let certs = await this.loadPlatformCerts();
            this.setPlatformCerts(certs);
        }
        return this.platformCerts;
    }
    setPlatformCerts(certs) {
        let newCerts = {};
        for (let key of Object.keys(certs)) {
            let cert = certs[key];
            if (typeof cert === 'string') {
                // 将证书内容封装为 PublicKey
                newCerts[key] = PublicKey_1.PublicKey.createByCertificateContent(cert, key);
            }
            else {
                newCerts[key] = cert;
            }
        }
        this.platformCerts = newCerts;
    }
    getPlatformCertKey() {
        if (!this.cacheKeyPlatformCert) {
            this.cacheKeyPlatformCert = `pay.platform_certs.${this.mchId}`;
        }
        return this.cacheKeyPlatformCert;
    }
    setPlatformCertKey(key) {
        this.cacheKeyPlatformCert = key;
        return this;
    }
    async loadPlatformCerts(force = false) {
        let cacheKey = this.getPlatformCertKey();
        let cache = this.app.getCache();
        let certs = await cache.get(cacheKey);
        if (force || !certs || Object.keys(certs).length === 0) {
            certs = {};
            let response = await this.app.getClient().get('/v3/certificates');
            let data = response.toObject();
            if (data && data.data && data.data.length > 0) {
                let nowTime = Math.round((new Date()).getTime() / 1000);
                data.data.forEach((item) => {
                    // 跳过有效期少于1天的证书
                    let expireTime = Math.round((new Date(item.expire_time)).getTime() / 1000) - 86400;
                    if (expireTime < nowTime)
                        return;
                    let content = AES_1.AES_GCM.decrypt(item.encrypt_certificate.ciphertext, this.app.getConfig().get('secret_key'), item.encrypt_certificate.nonce, item.encrypt_certificate.associated_data).toString();
                    certs[item.serial_no] = content;
                });
                if (Object.keys(certs).length > 0) {
                    await cache.set(cacheKey, certs, 36000); // 缓存10小时
                }
            }
        }
        return certs;
    }
}
module.exports = Merchant;
