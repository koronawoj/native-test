import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): boolean | Error => {
    if (status === 200 && data.type === 'json') {
        return true;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface SetDepositLimitsParamsType {
    period: 'daily' | 'weekly' | 'monthly'
    active: { amount: number },
    pending?: null
};


export const setDepositLimit = {
    browser: {
        params: ({ period, active, pending }:SetDepositLimitsParamsType): ParamsFetchType<SetDepositLimitsParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/set-deposit-limit',
                body: {
                    period,
                    active,
                    pending,
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/set-deposit-limit'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<SetDepositLimitsParamsType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const { active, pending, period } = params.req.body;

        const body: Partial<SetDepositLimitsParamsType> = {
            active: active
        };
        if (pending === null) {
            body.pending = null;
        }

        return {
            url: `${params.API_URL}/deposit-limits/${params.API_UNIVERSE}/${params.userSessionId}/${period}`,
            passToBackend: true,
            method: MethodType.PUT,
            body: body
        };

    }
};
