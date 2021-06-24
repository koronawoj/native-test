import { MethodType, GenerateUrlApiType, ResponseType, ParamsFetchType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_wallet_getWithdrawalListForUser, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_wallet_getWithdrawalListForUser';

export type TransactionItemType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const withdrawalsNew = {
    browser: {
        params: (): ParamsFetchType<{}> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/withdrawal-list',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/withdrawal-list',
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

        const resp = await openapi_wallet_getWithdrawalListForUser(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString(),
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
