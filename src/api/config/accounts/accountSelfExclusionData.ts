import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { decodeAccountSelfExclusion, AccountSelfExclusionModelType } from './accountSelfExclusionDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({})
});

const decodeSuccessResponse = buildValidator('SuccessResponse', SuccessResponseIO);

const ErrorResponseIO = t.union([
    t.interface({
        status: t.literal(400),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown,
    })
]);

type ErrorResponseType = t.TypeOf<typeof ErrorResponseIO>;

type SuccessResponseType = {
    status: 200,
    bodyJson: AccountSelfExclusionModelType
};

const decodeResponseError = buildValidator('getSelfExclusionData -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeAccountSelfExclusion(dataSuccess.bodyJson)
        };
    }
};

interface BodyType {
    months: number;
}


export const accountSelfExclusionData = {
    browser: {
        params: (months: string): ParamsFetchType<BodyType> => {
            return {
                type: MethodType.POST,
                url: '/api/user/self-exclusion',
                body: {
                    months: Number(months),
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api/user/self-exclusion',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<BodyType>): Promise<GenerateUrlApiType> => {

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
            url: `${params.API_URL}/self-exclusion/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                months: Number(params.req.body.months),
            }
        };
    }
};
