import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { ReferredBetSlipDataModelType, decodeReferredBetSlipDataModel, ReferredBetSlipErrorDataModelType, decodeReferredBetSlipErrorDataModel, decodeReferredBetSlipUserErrorDataModel, ReferredBetSlipUserErrorDataModelType } from './getReferredBetSlipDecode';


interface ReferredBetSlipDataModelInsideType {
    json: ReferredBetSlipDataModelType,
    responseType: 'success'
}
interface ReferredBetSlipErrorDataModelInsideType {
    json: ReferredBetSlipErrorDataModelType,
    responseType: 'error'
}
interface ReferredBetSlipUserErrorDataModelInsideType {
    json: ReferredBetSlipUserErrorDataModelType,
    responseType: 'error'
}


const decode = (status: number, data: ResponseType): ReferredBetSlipDataModelInsideType | ReferredBetSlipErrorDataModelInsideType | ReferredBetSlipUserErrorDataModelInsideType => {
    if ((status === 200 || status === 304) && data.type === 'json') {
        return {
            json: decodeReferredBetSlipDataModel(data.json),
            responseType: 'success'
        };
    }    

    if (status === 403 && data.type === 'json') {
        return {
            json: decodeReferredBetSlipUserErrorDataModel(data.json),
            responseType: 'error'
        };
    }

    if (status === 404 && data.type === 'json') {
        return {
            json: decodeReferredBetSlipErrorDataModel(data.json),
            responseType: 'error'
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getReferredBetSlip = {
    browser: {
        params: (): ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/betting/referred-betslip',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/betting/referred-betslip',
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

        return {
            url: `${params.API_URL}/referred-betslip/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
