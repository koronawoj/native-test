import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import qs from 'query-string';
import { decodeWithdrawalsListModel, WithdrawalsListModelType } from './accountsWithdrawalsDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): WithdrawalsListModelType  => {
    if (status === 200 && data.type === 'json') {
        return decodeWithdrawalsListModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


interface WithdrawalsListParamsType {
    status: unknown,
    type: string,
    sort: string,
    perPage: number,
    page: number
}

interface InnerBodyType {
    status: unknown,
    type: string,
    sort: string,
    perPage: number,
    page: number
}

export const withdrawals = {
    browser: {
        params: (params: WithdrawalsListParamsType): ParamsFetchType<InnerBodyType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/withdrawals',
                body: {
                    status: params.status,
                    type: params.type,
                    sort: params.sort,
                    perPage: params.perPage,
                    page: params.page
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/withdrawals',
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

        const queryParams = qs.stringify(params.req.body);

        return {
            url: `${params.API_URL}/transactions/${params.API_UNIVERSE}/${params.userSessionId}?${queryParams}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
