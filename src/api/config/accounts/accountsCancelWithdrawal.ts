import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import {
    CanceledWithdrawalType,
    decodeCanceledWithdrawal
} from 'src/api/config/accounts/accountsWithdrawalsDecode';

const decode = (status: number, data: ResponseType): CanceledWithdrawalType  => {
    if (status === 200 && data.type === 'json') {
        return decodeCanceledWithdrawal(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


interface CancelWithdrawalParamsType {
    id:number
}

interface InnerBodyType {
    id:number
}

export const cancelWithdrawal = {
    browser: {
        params: (params: CancelWithdrawalParamsType): ParamsFetchType<InnerBodyType> => {

            return {
                type: MethodType.DELETE,
                url: `/api-web/account/withdrawals/${params.id}/cancel`,
                body: {
                    id: params.id
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.DELETE,
        urlBrowser: '/api-web/account/withdrawals/:id/cancel',
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

        return {
            url: `${params.API_URL}/withdrawals/${params.API_UNIVERSE}/${params.userSessionId}/${params.req.params.id}/cancel`,
            passToBackend: true,
            method: MethodType.POST,
        };
    }
};
