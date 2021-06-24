import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_getLotteryNotifications, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_getLotteryNotifications';


export type LotteryNotificationItemType = Response200Type['notifications'] extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Array<LotteryNotificationItemType>  => {
    if (status === 200 && data.type === 'json') {
        const decodedData = decodeResponse200(data.json);

        if (decodedData instanceof Error) {
            throw decodedData;
        }

        return decodedData.notifications;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getLotteryNotifications = {
    browser: {
        params: ():  ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/lottery/notifications',
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/lottery/notifications',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {
        const userSessionId = params.userSessionId;

        if (userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const resp = await openapi_lottery_getLotteryNotifications(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: userSessionId.toString(),
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    },
};
