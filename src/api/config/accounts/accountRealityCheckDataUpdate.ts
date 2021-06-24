import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { decodeUpdateRealityCheckModel, UpdateRealityCheckModelType } from './accountRealityCheckDataUpdateDecode';
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
    bodyJson: UpdateRealityCheckModelType
};

const decodeResponseError = buildValidator('updateRealityCheckData -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeUpdateRealityCheckModel(dataSuccess.bodyJson)
        };
    }
};

interface RealityCheckParamsType {
    duration: number
};

export const accountRealityCheckDataUpdate = {
    browser: {
        params: (params: RealityCheckParamsType): ParamsFetchType<RealityCheckParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/reality-check',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/reality-check',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<RealityCheckParamsType>): Promise<GenerateUrlApiType> => {

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
            url: `${params.API_URL}/reality-check-settings/${params.API_UNIVERSE}/${params.userSessionId}/pending`,
            passToBackend: true,
            method: MethodType.PUT,
            body: params.req.body
        };
    }
};
