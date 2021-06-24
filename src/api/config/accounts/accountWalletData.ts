import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';

import { decodeAccountWalletDataModel, AccountWalletDataModelType } from './accountWalletDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): AccountWalletDataModelType   => {
    if (status === 200 && data.type === 'json') {
        return decodeAccountWalletDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountWalletData = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/account/wallet'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/account/wallet',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

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
            url: `${params.API_URL}/wallets/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
