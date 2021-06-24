import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { buildModelValidator } from 'src/api/utils/modelUtils';
import { chatTemplatesModel } from 'src/api/config/traderChat/traderChatDecode';

export const decodeChatTemplatesModel = buildModelValidator('Get chat templates', chatTemplatesModel);

export type ChatTemplatesModelType = ReturnType<typeof decodeChatTemplatesModel>;

const decode = (status: number, data: ResponseType): ChatTemplatesModelType  => {
    if (status === 200 && data.type === 'json') {
        const result = decodeChatTemplatesModel(data.json);
        return result;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const getChatTemplates = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/chat-templates'
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/chat-templates',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/chats/message-templates/${params.API_UNIVERSE}/staff`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
