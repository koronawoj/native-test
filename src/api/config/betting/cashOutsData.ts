import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { CashOutMainDataModelType, decodeAccountCashOutDataModel, decodeAccountCashOutErrorDataModel, AccountCashOutErrorModelType } from './cashOutsDataDecode';


const decode = (status: number, data: ResponseType): CashOutMainDataModelType | AccountCashOutErrorModelType => {
    if (status === 200 && data.type === 'json') {
        return decodeAccountCashOutDataModel({
            data: data.json,
            type: 'success'
        });
    }
    if (status === 403 && data.type === 'json') {
        return decodeAccountCashOutErrorDataModel({
            data: data.json,
            type: 'error'
        });
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface CashOutParamsType {
    betsIds: Array<number>
};

export const cashOutsData = {
    browser: {
        params: (params: CashOutParamsType): ParamsFetchType<CashOutParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/betting/cashouts',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/betting/cashouts',
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
            url: `${params.API_URL}/cashout/${params.API_UNIVERSE}/offers`,
            passToBackend: true,
            method: MethodType.POST,
            body: params.req.body.betsIds
        };
    }
};
