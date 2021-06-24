import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_postLotteryNotificationsConfirmed } from 'src/api_openapi/generated/openapi_lottery_postLotteryNotificationsConfirmed';

const decode = (status: number, data: ResponseType): void | null  => {
    if (status === 200) {
        return;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface ParamsType  {
    ticketIds: Array<number>
}

export const postLotteryNotificationsConfirmed = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/lottery/notifications-confirmed',
                body: params,
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/lottery/notifications-confirmed',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {
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

        const resp = await openapi_lottery_postLotteryNotificationsConfirmed(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: userSessionId.toString(),
            requestBody: {
                ticketIds: params.req.body.ticketIds
            }
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    },
};
