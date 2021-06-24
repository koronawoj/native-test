import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { RetrieveCashOutModelType, decodeRetrieveCashOutDataModel, RetrieveCashOutErrorModelType, decodeRetrieveCashOutDataErrorModel } from './retrieveCashOutDecode';

interface RetrieveCashOutDataModelInsideType {
    json: RetrieveCashOutModelType,
    responseType: 'success'
}

interface RetrieveCashOutDataErrorModelInsideType {
    json: RetrieveCashOutErrorModelType,
    responseType: 'error'
}
const decode = (status: number, data: ResponseType): RetrieveCashOutDataModelInsideType | RetrieveCashOutDataErrorModelInsideType  => {
    if (status === 200 && data.type === 'json') {
        return {
            json: decodeRetrieveCashOutDataModel(data.json),
            responseType: 'success'
        };
    }

    if (status >= 400 && data.type === 'json') {
        return {
            json: decodeRetrieveCashOutDataErrorModel(data.json),
            responseType: 'error'
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface CashOutParamsType {
    betId: number,
    value: number,
};

export const retrieveCashOut = {
    browser: {
        params: (params: CashOutParamsType): ParamsFetchType<CashOutParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/betting/retrive-cashouts',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/betting/retrive-cashouts',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<CashOutParamsType>): Promise<GenerateUrlApiType> => {

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
            url: `${params.API_URL}/cashout/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.POST,
            body: params.req.body
        };
    }
};
