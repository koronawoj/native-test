import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { buildModelValidator } from 'src/api/utils/modelUtils';
import { chatStatusModel } from 'src/api/config/traderChat/traderChatDecode';

export const decodeChatStatusModel = buildModelValidator('Get chat status', chatStatusModel);

export type ChatStatusModelType = ReturnType<typeof decodeChatStatusModel>;

const decode = (status: number, data: ResponseType): ChatStatusModelType  => {
    if (status === 200 && data.type === 'json') {
        const result = decodeChatStatusModel(data.json);
        return result;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const getChatStatus = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/chat-status'
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/chat-status',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/chats/message-templates/${params.API_UNIVERSE}/chat-disable`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
