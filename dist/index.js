"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormData = exports.PrivateKey = exports.PublicKey = exports.ServerRequest = exports.CacheInterface = exports.Channel = exports.OpenWork = exports.Work = exports.OpenPlatform = exports.Pay = exports.MiniApp = exports.MiniStore = exports.OfficialAccount = void 0;
exports.defineOfficialAccountConfig = defineOfficialAccountConfig;
exports.defineMiniStoreConfig = defineMiniStoreConfig;
exports.defineMiniAppConfig = defineMiniAppConfig;
exports.definePayConfig = definePayConfig;
exports.defineOpenPlatformConfig = defineOpenPlatformConfig;
exports.defineWorkConfig = defineWorkConfig;
exports.defineOpenWorkConfig = defineOpenWorkConfig;
exports.defineChannelConfig = defineChannelConfig;
exports.defineLogHandler = defineLogHandler;
exports.defineOfficeAccountServerHandler = defineOfficeAccountServerHandler;
exports.defineMiniStoreServerHandler = defineMiniStoreServerHandler;
exports.defineMiniAppServerHandler = defineMiniAppServerHandler;
exports.defineWorkServerHandler = defineWorkServerHandler;
exports.defineOpenPlatformServerHandler = defineOpenPlatformServerHandler;
exports.defineOpenWorkServerHandler = defineOpenWorkServerHandler;
exports.defineChannelServerHandler = defineChannelServerHandler;
exports.defineHttpClientFailureJudgeClosure = defineHttpClientFailureJudgeClosure;
exports.definePaymentFailHandler = definePaymentFailHandler;
exports.definePaymentAlertHandler = definePaymentAlertHandler;
exports.definePaymentPaidHandler = definePaymentPaidHandler;
exports.definePaymentRefundedHandler = definePaymentRefundedHandler;
exports.definePaymentScannedHandler = definePaymentScannedHandler;
const Application_1 = __importDefault(require("./OfficialAccount/Application"));
exports.OfficialAccount = Application_1.default;
const Application_2 = __importDefault(require("./MiniStore/Application"));
exports.MiniStore = Application_2.default;
const Application_3 = __importDefault(require("./MiniApp/Application"));
exports.MiniApp = Application_3.default;
const Application_4 = __importDefault(require("./Pay/Application"));
exports.Pay = Application_4.default;
const Application_5 = __importDefault(require("./OpenPlatform/Application"));
exports.OpenPlatform = Application_5.default;
const Application_6 = __importDefault(require("./Work/Application"));
exports.Work = Application_6.default;
const Application_7 = __importDefault(require("./OpenWork/Application"));
exports.OpenWork = Application_7.default;
const Application_8 = __importDefault(require("./Channel/Application"));
exports.Channel = Application_8.default;
const CacheInterface_1 = __importDefault(require("./Core/Contracts/CacheInterface"));
exports.CacheInterface = CacheInterface_1.default;
const ServerRequest_1 = __importDefault(require("./Core/Http/ServerRequest"));
exports.ServerRequest = ServerRequest_1.default;
const form_data_1 = __importDefault(require("form-data"));
exports.FormData = form_data_1.default;
const PublicKey_1 = require("./Core/Support/PublicKey");
Object.defineProperty(exports, "PublicKey", { enumerable: true, get: function () { return PublicKey_1.PublicKey; } });
const PrivateKey_1 = require("./Core/Support/PrivateKey");
Object.defineProperty(exports, "PrivateKey", { enumerable: true, get: function () { return PrivateKey_1.PrivateKey; } });
/**
 * 定义公众号配置
 * @param config
 */
function defineOfficialAccountConfig(config) {
    return config;
}
/**
 * 定义微信小店配置
 * @param config
 */
function defineMiniStoreConfig(config) {
    return config;
}
/**
 * 定义小程序配置
 * @param config
 */
function defineMiniAppConfig(config) {
    return config;
}
/**
 * 定义支付配置
 * @param config
 */
function definePayConfig(config) {
    return config;
}
/**
 * 定义开放平台配置
 * @param config
 */
function defineOpenPlatformConfig(config) {
    return config;
}
/**
 * 定义企业微信配置
 * @param config
 */
function defineWorkConfig(config) {
    return config;
}
/**
 * 定义企业微信开放平台配置
 * @param config
 */
function defineOpenWorkConfig(config) {
    return config;
}
/**
 * 定义视频号配置
 * @param config
 */
function defineChannelConfig(config) {
    return config;
}
/**
 * 定义日志处理函数
 * @param func
 */
function defineLogHandler(func) {
    return func;
}
/**
 * 定义公众号服务端消息处理函数
 * @param func
 */
function defineOfficeAccountServerHandler(func) {
    return func;
}
/**
 * 定义微信小店服务端消息处理函数
 * @param func
 */
function defineMiniStoreServerHandler(func) {
    return func;
}
/**
 * 定义小程序服务端消息处理函数
 * @param func
 */
function defineMiniAppServerHandler(func) {
    return func;
}
/**
 * 定义企业微信服务端消息处理函数
 * @param func
 */
function defineWorkServerHandler(func) {
    return func;
}
/**
 * 定义开放平台服务端消息处理函数
 * @param func
 */
function defineOpenPlatformServerHandler(func) {
    return func;
}
/**
 * 定义企业微信开放平台服务端消息处理函数
 * @param func
 */
function defineOpenWorkServerHandler(func) {
    return func;
}
/**
 * 定义视频号服务端消息处理函数
 * @param func
 */
function defineChannelServerHandler(func) {
    return func;
}
/**
 * 定义HttpClient错误判定回调
 * @param func
 */
function defineHttpClientFailureJudgeClosure(func) {
    return func;
}
/**
 * 定义支付通知错误处理函数
 * @param func
 */
function definePaymentFailHandler(func) {
    return func;
}
/**
 * 定义支付业务错误处理函数
 * @param func
 */
function definePaymentAlertHandler(func) {
    return func;
}
/**
 * 定义支付结果处理回调函数
 * @param func
 */
function definePaymentPaidHandler(func) {
    return func;
}
/**
 * 定义退款结果处理回调函数
 * @param func
 */
function definePaymentRefundedHandler(func) {
    return func;
}
/**
 * 定义扫码支付结果处理回调函数
 * @param func
 */
function definePaymentScannedHandler(func) {
    return func;
}
