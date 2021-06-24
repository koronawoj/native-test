import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';

import { decodeBankingConfigsDataModel, BankingConfigsModelType } from './accountBankingConfigsDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): BankingConfigsModelType   => {
    if (status === 200 && data.type === 'json') {
        return decodeBankingConfigsDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountBankingConfigs = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/account/banking-configs'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/account/banking-configs',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

        return {
            url: `${params.API_URL}/banking-configs/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
