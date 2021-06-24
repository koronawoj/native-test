import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_getPendingLottery, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_getPendingLottery';


const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        const dataSuccess = decodeResponse200(data.json);

        return dataSuccess;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getPendingLottery = {
    browser: {
        params: ():  ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/lottery/tickets/pending',
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/lottery/tickets/pending',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User is not logged in',
                }
            };
        }

        const resp = await openapi_lottery_getPendingLottery(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString(),
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    },
};
