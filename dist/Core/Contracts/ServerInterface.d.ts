import ResponseInterface from "../Http/Contracts/ResponseInterface";
import DecryptMessageMixin from "../Mixins/DecryptMessageMixin";
import HandlersMixin from "../Mixins/HandlersMixin";
import ResponseMessageMixin from "../Mixins/ResponseMessageMixin";
import ServerRequestMixin from "../Mixins/ServerRequestMixin";
declare abstract class ServerInterface {
    constructor();
    /**
     * 处理消息
     */
    serve(): Promise<ResponseInterface>;
}
interface ServerInterface extends HandlersMixin, DecryptMessageMixin, ResponseMessageMixin, ServerRequestMixin {
}
export = ServerInterface;
