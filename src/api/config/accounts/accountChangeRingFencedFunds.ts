import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

import { decodeBoolean } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';

const modelConfig = {
    ringFencedFunds: buildApiItemDefault(decodeBoolean, false)
};

export const decodeRingFencedFundsResponse = buildModelValidator('ringFencedFunds', modelConfig);

const decode = (status: number, data: ResponseType): boolean => {
    if (status === 200 && data.type === 'json') {
        return decodeRingFencedFundsResponse(data.json).ringFencedFunds;
    }
    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface ChangeRingFencedFundsParamsType {
    ringFencedFunds: boolean,
}

export const accountChangeRingFencedFunds = {
    browser: {
        params: (params: ChangeRingFencedFundsParamsType): ParamsFetchType<ChangeRingFencedFundsParamsType> => {
            return {
                type: MethodType.PATCH,
                url: '/api-web/user/ring-fenced-funds',
                body: params,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PATCH,
        urlBrowser: '/api-web/user/ring-fenced-funds'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ChangeRingFencedFundsParamsType>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const { ringFencedFunds } = params.req.body;

        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.PATCH,
            body: {
                ringFencedFunds
            }
        };
    }
};
