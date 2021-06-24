import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

export interface UpdateTopUpLimitsParamsType {
    daily: number,
    weekly: number,
    monthly: number
};

export const updateTopUpLimits = { 
    browser: {
        params: ({ daily, weekly, monthly }:UpdateTopUpLimitsParamsType): ParamsFetchType<UpdateTopUpLimitsParamsType> => {
            return {
                type: MethodType.PUT,
                url: '/api/user/deposit-limit',
                body: {
                    daily, 
                    weekly,
                    monthly,
                }
            };
        },
        decode: (status: number, data: ResponseType): void => {
            if (status === 200) {
                return;
            }
        
            throw new Error(`unhandled response ${status} - ${data.type}`);
        }
    },
    express: {
        method: MethodType.PUT,
        urlBrowser: '/api/user/deposit-limit'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<UpdateTopUpLimitsParamsType>): Promise<GenerateUrlApiType> => {
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
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.PUT,
            body: params.req.body
        };

    }
};
