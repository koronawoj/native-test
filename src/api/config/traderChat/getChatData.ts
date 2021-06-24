import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { buildModelValidator } from 'src/api/utils/modelUtils';
import { chatDataModel } from 'src/api/config/traderChat/traderChatDecode';

export const decodeChatDataModel = buildModelValidator('Get chat data', chatDataModel);

export type ChatDataModelType = ReturnType<typeof decodeChatDataModel>;

const decode = (status: number, data: ResponseType): ChatDataModelType | null  => {
    if (status === 200 && data.type === 'json') {
        return decodeChatDataModel(data.json);
    }

    // if there is no conversation (no data in DB), backend returns 404
    if (status === 404) {
        return null;
    }

    throw new Error(`Unhandled response: 'getChatData', ${status} - ${data.type}`);
};


export const getChatData = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/chat-data'
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/chat-data',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

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
            url: `${params.API_URL}/chats/${params.API_UNIVERSE}/customers/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
