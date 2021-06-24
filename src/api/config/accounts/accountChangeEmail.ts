import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { UniverseType } from 'src_common/common/universe';
import { fetchGet } from '@twoupdigital/realtime-server/libjs/fetch';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({})
});

const EmailExistsErrorResponseIO = t.interface({
    status: t.literal(422),
    bodyJson: t.interface({
        code: t.literal('invalid'),
        errors: t.array(
            t.interface({
                code: t.literal('already-exists'),
                debugDetails: t.string,
                field: t.literal('email'),
                resource: t.literal('Account'),
            })
        ),
        message: t.string
    })
});

const ErrorResponseIO = EmailExistsErrorResponseIO;

const decodeResponse = buildValidator('change email -> SuccessResponse', SuccessResponseIO);
const decodeErrorResponse = buildValidator('change email -> ErrorResponse', ErrorResponseIO);

type SuccessResponseType = t.TypeOf<typeof SuccessResponseIO>;
type ErrorResponseType = t.TypeOf<typeof ErrorResponseIO>;

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

export interface ChangeEmailParamsType {
    email: string,
    oldEmail: string,
};

const CustomerResponseBodyIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({
        email: t.string
    })
});

const decodeCustomerRequestResponse = buildValidator('change email -> CustomerResponseIO', CustomerResponseBodyIO, true);

const customerRequest = async (API_URL: string, API_UNIVERSE: UniverseType, sessionUserId: number, backendToken: string): Promise<string | null> => {
    const response = await fetchGet({
        url: `${API_URL}/accounts/${API_UNIVERSE}/customer/${sessionUserId}`,
        backendToken,
        decode: decodeCustomerRequestResponse,
    });

    if (response.status === 200) {
        return response.bodyJson.email;
    }
    
    return null;
};

interface InnerBody {
    email: string,
    oldEmail: string,
}

export const accountChangeEmail = {
    browser: {
        params: ({ email, oldEmail }:ChangeEmailParamsType): ParamsFetchType<InnerBody> => {
            return {
                type: MethodType.PATCH,
                url: '/api-web/user/change-email',
                body: {
                    email,
                    oldEmail
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PATCH,
        urlBrowser: '/api-web/user/change-email'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBody>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const additionalResponse = await customerRequest(params.API_URL, params.API_UNIVERSE, params.userSessionId, params.jwtToken);

        if (additionalResponse === null) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'Cant get user data',
                }
            };
        }

        if (additionalResponse.trim().toLowerCase() !== params.req.body.oldEmail) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'Email is invalid',
                }
            };
        }

        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.PATCH,
            body: {
                email: params.req.body.email
            }
        };
    }
};
