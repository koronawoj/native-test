import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_getActualLottery, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_getActualLottery';

const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getActualLottery = {
    browser: {
        params: ():  ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/lottery/draws/current',
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/lottery/draws/current',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {
        const userSessionId = params.userSessionId === null ? '' : params.userSessionId;


        const resp = await openapi_lottery_getActualLottery(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
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
