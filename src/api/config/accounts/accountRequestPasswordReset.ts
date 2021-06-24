import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({})
});

const AccountNotFoundErrorResponseIO = t.interface({
    status: t.literal(404),
    bodyJson: t.interface({
        code: t.literal('account-not-found'),
        message: t.string
    })
});

const InternalErrorResponseIO = t.interface({
    status: t.literal(500),
    bodyJson: t.unknown
});

const ErrorResponseIO = AccountNotFoundErrorResponseIO;

const decodeResponse = buildValidator('reset password -> SuccessResponse', SuccessResponseIO);
const decodeErrorResponse = buildValidator('reset password -> ErrorResponse', t.union([ErrorResponseIO, InternalErrorResponseIO]));

type SuccessResponseType = t.TypeOf<typeof SuccessResponseIO>;
type ErrorResponseType = t.TypeOf<typeof ErrorResponseIO> | t.TypeOf<typeof InternalErrorResponseIO>;

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeErrorResponse(data);
    } else {
        return {
            status: dataSuccess.status,
            bodyJson: dataSuccess.bodyJson
        };
    }
};

export interface ResetPasswordParamsType {
    email?: string,
    sendViaSMS?: boolean,
    verify?: boolean
}

interface InnerBody {
    email?: string,
    sendViaSMS: boolean,
    verify: boolean
}

export const accountRequestPasswordReset = {
    browser: {
        params: ({ email, sendViaSMS, verify }:ResetPasswordParamsType): ParamsFetchType<InnerBody> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/request-password-reset',
                body: {
                    email,
                    sendViaSMS: sendViaSMS ?? false,
                    verify: verify ?? false
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/request-password-reset'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBody>): Promise<GenerateUrlApiType> => {

        const { email, sendViaSMS, verify } = params.req.body;

        if (email === undefined) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'Email is invalid',
                }
            };
        }

        const xForwardedFor = params.getHeader('x-forwarded-for') ?? params.req?.connection?.remoteAddress;

        if (xForwardedFor === undefined) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'Missing header "x-forwarded-for"',
                }
            };
        }

        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/password-reset-token`,
            passToBackend: true,
            method: MethodType.POST,
            headers: {
                'x-forwarded-for': xForwardedFor,
            },
            body: {
                email,
                sendVia: sendViaSMS === true ? 'sms' : undefined,
                verify,
            }
        };
    }
};
