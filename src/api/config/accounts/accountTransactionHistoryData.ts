import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { Response200Type, decodeResponse200, openapi_wallet_getTransactionHistory, ParamsType } from 'src/api_openapi/generated/openapi_wallet_getTransactionHistory';

import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

export type TransactionItemType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export type TransactionParamsType = null | 'all' | 'deposit' | 'withdrawal' | 'bet' | 'casino-wager' | 'net-deposit' | 'virtualsports-wager' | 'live-casino-wager' | 'lottery';

type InnerBodyType = ParamsType['requestBody'];

export const accountTransactionsData = {
    browser: {
        params: (params: ParamsType['requestBody']): ParamsFetchType<InnerBodyType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/transaction-history',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/transaction-history',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBodyType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }
        const { page, perPage, type } = params.req.body;

        const coreStartDate = params.req.body.startDate ?? null;
        const startDate = coreStartDate !== null 
            ? `${coreStartDate}T00:00:00Z`
            : undefined;

        const coreEndDate = params.req.body.endDate ?? null;
        const endDate = coreEndDate !== null
            ? `${coreEndDate}T23:59:59Z`
            : undefined;

        const query = {
            page,
            perPage,
            type,
            startDate,
            endDate,
        };

        const resp = await openapi_wallet_getTransactionHistory(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString(),
            requestBody: query
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
