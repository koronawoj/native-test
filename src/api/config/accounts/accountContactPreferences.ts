import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { decodeContactPreferencesModel, ContactPreferencesModelType } from './accountContactPreferencesDecode';
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
    bodyJson: ContactPreferencesModelType
};

const decodeResponseError = buildValidator('contact preferences -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeContactPreferencesModel(dataSuccess.bodyJson)
        };
    }
};

export interface ContactPreferencesParamsType {
    contactPreferences: Array<string>
};


export const accountContactPreferences = { 
    browser: {
        params: ({ contactPreferences }:ContactPreferencesParamsType): ParamsFetchType<ContactPreferencesParamsType> => {
            return {
                type: MethodType.PUT,
                url: '/api-web/user/contact-preferences',
                body: {
                    contactPreferences
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PUT,
        urlBrowser: '/api-web/user/contact-preferences'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ContactPreferencesParamsType>): Promise<GenerateUrlApiType> => {
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
            method: MethodType.PATCH,
            body: params.req.body
        };
    }
};
