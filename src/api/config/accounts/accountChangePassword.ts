import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { UniverseType } from 'src_common/common/universe';
import { fetchPost, fetchGet } from '@twoupdigital/realtime-server/libjs/fetch';
import { ChangePasswordModelType, decodeChangePasswordModel } from './accountChangePasswordDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

export enum PasswordValidation {
    WRONG_OLD_PASSWORD = 'Incorrect old password'
};

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({})
});

const decodeSuccessResponse = buildValidator('SuccessResponse', SuccessResponseIO);

const ResponseBodyIO = t.union([
    t.interface({
        status: t.literal(201),
        bodyJson: t.interface({
            accountId: t.number
        })
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({
            error: t.string,
            error_description: t.string
        })
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(403),
        bodyJson: t.unknown,
    })

]);

const ResponseGetUserIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.interface({
            email: t.string
        })
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(403),
        bodyJson: t.unknown,
    })

]);

const decodeResponse = buildValidator('change password additional -> ResponseIO', ResponseBodyIO, true);
const decodeGetUser = buildValidator('change password additional -> ResponseIO', ResponseGetUserIO, true);

const WrongPasswordErrorIO = t.interface({
    status: t.literal(400),
    error: t.interface({
        error: t.string,
        error_description: t.string
    })
});

const ErrorResponseIO = t.union([
    t.interface({
        status: t.union([t.literal(400), t.literal(403)]),
        bodyJson: t.interface({
            errorMessage: t.string
        })
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown,
    })
]);

export type ChangePasswordErrorResponseType = t.TypeOf<typeof ErrorResponseIO>;
export type AdditionalReqChangePasswordErrorResponseType = t.TypeOf<typeof WrongPasswordErrorIO>;

export type ChangePasswordSuccessResponseType = {
    status: 200,
    bodyJson: ChangePasswordModelType
};

const decodeResponseError = buildValidator('change password -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): ChangePasswordSuccessResponseType | ChangePasswordErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeChangePasswordModel(dataSuccess.bodyJson)
        };
    }
};

export interface ChangePasswordParamsType {
    newPassword: string,
    oldPassword: string,
};

const additionalRequest = async (API_URL: string, API_UNIVERSE: UniverseType, backendToken: string, userSessionId: number, password: string): Promise<{status: 201, accountId: number} | AdditionalReqChangePasswordErrorResponseType | null> => {

    const getUserDataResponse = await fetchGet({
        url: `${API_URL}/accounts/${API_UNIVERSE}/customer/${userSessionId}`,
        backendToken,
        decode: decodeGetUser
    });

    if ( getUserDataResponse.status !== 200) {
        return {
            status: 400,
            error: {
                error: 'validation error',
                error_description: 'get user data error'
            }
        };
    }
    const userEmail = getUserDataResponse.bodyJson.email;
    const userValidationResponse = await fetchPost({
        url: `${API_URL}/sessions/${API_UNIVERSE}/customer/`,
        backendToken,
        decode: decodeResponse,
        body: {
            username: userEmail,
            password,
            grant_type: 'password'
        }
    });

    if (userValidationResponse.status === 201) {
        return {
            status: 201,
            accountId: userValidationResponse.bodyJson.accountId
        };
    }

    //Error from BE is wrong old pass to user email
    //error: 'invalid_grant',
    //error_description: 'Invalid username or password'
    if (userValidationResponse.status === 400) {
        return {
            status: 400,
            error: {
                error: userValidationResponse.bodyJson.error,
                error_description: userValidationResponse.bodyJson.error_description
            }
        };
    }

    return null;
};



export const accountChangePassword = {
    browser: {
        params: ({ newPassword, oldPassword }:ChangePasswordParamsType): ParamsFetchType<ChangePasswordParamsType> => {
            return {
                type: MethodType.PATCH,
                url: '/api-web/user/change-password',
                body: {
                    newPassword,
                    oldPassword
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PATCH,
        urlBrowser: '/api-web/user/change-password'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ChangePasswordParamsType>): Promise<GenerateUrlApiType> => {
        const { oldPassword, newPassword } = params.req.body;

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const additionalResponse = await additionalRequest(params.API_URL, params.API_UNIVERSE, params.jwtToken, params.userSessionId, oldPassword);

        if (additionalResponse === null) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'Cant get user data',
                }
            };
        }

        if (additionalResponse.status === 400 && additionalResponse.error.error_description === 'Invalid username or password') {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: PasswordValidation.WRONG_OLD_PASSWORD,
                }
            };
        }

        if (additionalResponse.status === 400) {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    errorMessage: 'User validation error',
                }
            };
        }


        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.PATCH,
            body: {
                password: newPassword
            }
        };
    }
};
