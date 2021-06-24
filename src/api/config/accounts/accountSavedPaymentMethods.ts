import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { SavePaymentMethodsModelType, decodeSavePaymentMethodsDataModel } from './accountSavedPaymentMethodsDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): SavePaymentMethodsModelType   => {
    if (status === 200 && data.type === 'json') {
        return decodeSavePaymentMethodsDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountSavedPaymentMethod = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/account/saved-payment-methods/'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/account/saved-payment-methods/',
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
            url: `${params.API_URL}/saved-payment-methods/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
