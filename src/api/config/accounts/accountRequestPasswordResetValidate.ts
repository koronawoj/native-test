import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({
        valid: t.boolean,
        attempts: t.number
    })
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

const decodeResponse = buildValidator('reset password validate -> SuccessResponse', SuccessResponseIO);
const decodeErrorResponse = buildValidator('reset password validate -> ErrorResponse', t.union([ErrorResponseIO, InternalErrorResponseIO]));

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

interface ResetPasswordParamsType {
    username: string,
    receivedVia: string,
    tokenValue: string
}

interface InnerBody {
    username: string,
    receivedVia: string,
    tokenValue: string
}

export const accountRequestPasswordResetValidate = {
    browser: {
        params: ({ username, receivedVia, tokenValue }:ResetPasswordParamsType): ParamsFetchType<InnerBody> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/request-password-reset-validate',
                body: {
                    username,
                    receivedVia,
                    tokenValue
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/request-password-reset-validate'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBody>): Promise<GenerateUrlApiType> => {
        const { username, receivedVia, tokenValue } = params.req.body;

        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/validate-reset-token`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                username,
                receivedVia,
                tokenValue,
                ip: null
            }
        };
    }
};
