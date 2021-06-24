import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { AccountBonusesDataModelType, decodeAccountBonusesDataModel } from './accountBonusesDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): AccountBonusesDataModelType  => {
    if (status === 200 && data.type === 'json') {
        return decodeAccountBonusesDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountBonusesData = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/account/bonuses'
            };
        },
        decode: decode
    },

    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/account/bonuses',
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
            url: `${params.API_URL}/bonus-rules/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET
        };

    }

};
