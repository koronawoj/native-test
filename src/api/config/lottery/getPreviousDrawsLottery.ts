import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_getPreviousDrawsLottery, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_getPreviousDrawsLottery';

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

export const getPreviousDrawsLottery = {
    browser: {
        params: ():  ParamsFetchType<Response200Type> => {
            return {
                type: MethodType.GET,
                url: '/api-web/lottery/draws/previous',
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/lottery/draws/previous',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<Response200Type>): Promise<GenerateUrlApiType> => {

        const resp = await openapi_lottery_getPreviousDrawsLottery(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    },
};
