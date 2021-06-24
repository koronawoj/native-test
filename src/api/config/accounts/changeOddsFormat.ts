import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { decodeChangeOddFormatDataModel, ChangeOddFormatDataModelType } from './changeOddsFormatDecode';
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
    bodyJson: ChangeOddFormatDataModelType
};

const decodeResponseError = buildValidator('onChangeOddsFormat -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeChangeOddFormatDataModel(dataSuccess.bodyJson)
        };
    }
};

export interface ChangeOddFormatParamsType {
    oddsFormat: string,
};

export const changeOddsFormat = {
    browser: {
        params: (params: ChangeOddFormatParamsType): ParamsFetchType<ChangeOddFormatParamsType> => {
            return {
                type: MethodType.PATCH,
                url: '/api-web/account/change-odds-type',
                body: params,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PATCH,
        urlBrowser: '/api-web/account/change-odds-type'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ChangeOddFormatParamsType>): Promise<GenerateUrlApiType> => {

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
            method: MethodType.PATCH
        };
    }
};
