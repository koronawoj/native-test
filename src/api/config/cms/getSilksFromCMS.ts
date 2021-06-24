import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { GetSilksFromCMSType, decodeGetSilksFromCMS } from './getSilksFromCMSDecode';
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
    bodyJson: GetSilksFromCMSType
};

const decodeResponseError = buildValidator('getSilksFromCMS -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeGetSilksFromCMS(dataSuccess.bodyJson)
        };
    }
};

export const getSilksFromCMS = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/get-race-data'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/get-race-data',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/cms/horseracingrunners/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
