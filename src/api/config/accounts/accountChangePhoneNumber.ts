import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { ChangePhoneModelType, decodeChangePhoneModel } from './accountChangePhoneNumberDecode';
import { CountryDropdownOptions } from 'src/universes/star/ui/account/CountryDropdown/CountryDropdown.state';

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
    bodyJson: ChangePhoneModelType
};

const decodeResponseError = buildValidator('Change phone number -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeChangePhoneModel(dataSuccess.bodyJson)
        };
    }
};

export interface ChangePhoneParamsType {
    prefixFullData: CountryDropdownOptions,
    number: string
};

interface ChangePhoneInnerDataType {
    number: string,
    prefix: string,
    country: string
}

export const accountChangePhoneNumber = {
    browser: {
        params: ({ number, prefixFullData }: ChangePhoneParamsType): ParamsFetchType<ChangePhoneInnerDataType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/change-phone',
                body: {
                    number,
                    prefix: prefixFullData.label,
                    country: prefixFullData.id
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/change-phone'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ChangePhoneInnerDataType>): Promise<GenerateUrlApiType> => {
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
            body: {
                mobilePhone: {
                    number: params.req.body.number,
                    prefix: params.req.body.prefix,
                    country: params.req.body.country
                }
            }
        };
    }
};
