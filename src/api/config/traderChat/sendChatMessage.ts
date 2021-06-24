import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { ChatMessageType, decodeErrors, decodeMessage, ErrorsType } from 'src/api/config/traderChat/traderChatDecode';


interface SendChatMessageSuccess {
    data: ChatMessageType,
    responseType: 'success'
}
interface SendChatMessageError {
    data: ErrorsType,
    responseType: 'error'
}


const decode = (status: number, data: ResponseType): SendChatMessageSuccess | SendChatMessageError => {
    if ((status === 200 || status === 201) && data.type === 'json') {
        const result = decodeMessage(data.json);
        return {
            responseType: 'success',
            data: result
        };;
    }

    if (status === 422 && data.type === 'json') {
        return {
            responseType: 'error',
            data: decodeErrors(data.json)
        };
    }

    throw new Error(`unhandled 'sendChatMessage' response ${status} - ${data.type}`);
};

type ParamsType = Omit<ChatMessageType, 'id' | 'chatId'>;

export const sendChatMessage = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/chat-message',
                body: params
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/chat-message',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        return {
            url: `${params.API_URL}/chats/${params.API_UNIVERSE}/customers/${params.userSessionId}/messages`,
            passToBackend: true,
            method: MethodType.POST,
            body: params.req.body
        };
    }
};
