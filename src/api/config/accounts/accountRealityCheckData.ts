import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { decodeAccountRealityCheckDataModel, AccountRealityCheckDataModelType } from './accountRealityCheckDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): AccountRealityCheckDataModelType   => {
    if (status === 200 && data.type === 'json') {
        return decodeAccountRealityCheckDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountRealityCheckData = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/account/reality-check'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/account/reality-check',
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
            url: `${params.API_URL}/reality-check-settings/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
