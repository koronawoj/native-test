import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_getSettledLottery, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_getSettledLottery';


const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        const dataSuccess = decodeResponse200(data.json);
        if (dataSuccess instanceof Error) {
            throw dataSuccess;
        }
        return dataSuccess;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getSettledLottery = {
    browser: {
        params: ():  ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/lottery/tickets/settled',
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/lottery/tickets/settled',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const resp = await openapi_lottery_getSettledLottery(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
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
