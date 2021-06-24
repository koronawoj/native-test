import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import Axios from 'axios';
import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { decodeBoolean, decodeString } from 'src/api/utils/commonModelValidators';
import { openapi_hellosoda_createSession } from 'src/api_openapi/generated/openapi_hellosoda_createSession';
import { openapi_hellosoda_endSession } from 'src/api_openapi/generated/openapi_hellosoda_endSession';
const FormData = require('form-data');

export const decodeVerifyProfileViaDocumentcDataModel = buildModelValidator('verifyProfileViaDocument data', {
    backSideRequired: buildApiItemDefault(decodeBoolean, false),
    sessionId: buildApiItemDefault(decodeString, '')
});

export type verifyProfileViaDocumentModelType = ReturnType<typeof decodeVerifyProfileViaDocumentcDataModel>;

const decodeError = buildModelValidator('verifyProfileViaDocument ERROR decode', {
    message: buildApiItemDefault(buildValidator('Document Error Type', t.union([t.literal('METRICS FAILED'), t.literal('METRICS AND CLASSIFICATION FAILED'), t.literal('CLASSIFICATION FAILED')]), true), ''),
    errors:  buildApiItemDefault(buildValidator('Array', t.array(t.unknown), false), [])
});

export type verifyProfileErrorModelType = ReturnType<typeof decodeError>;

type SuccessResponseType = {
    type: 'success',
    body: verifyProfileViaDocumentModelType
};

type ErrorResponseType = {
    type: 'error',
    body: verifyProfileErrorModelType
};

const decode = (status: number, data: ResponseType): SuccessResponseType | ErrorResponseType  => {
    if (status >= 400 && data.type === 'json') {
        return {
            type: 'error',
            body: decodeError(data.json)
        };
    }

    if (status === 200 && data.type === 'json' ) {
        return {
            type: 'success',
            body: decodeVerifyProfileViaDocumentcDataModel(data.json)
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface VerifyProfileViaDocumentParamsType {
    file: string,
    side: 'front' | 'back',
    newSession: boolean,
    sessionId?: string,
}

export const verifyProfileViaDocument = {
    browser: {
        params: (params: VerifyProfileViaDocumentParamsType): ParamsFetchType<VerifyProfileViaDocumentParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/profile-verification-document',
                body: params,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/profile-verification-document'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<VerifyProfileViaDocumentParamsType>): Promise<GenerateUrlApiType> => {
        const userSessionId = params.userSessionId;
        if (userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        let helloSodaParams: {sessionId: string | undefined} = {
            sessionId: undefined
        };
        if (params.req.body.newSession) {
            const sessionParams = {
                universe: params.API_UNIVERSE,
                accountType: 'customer',
                accountId: userSessionId,
                croppingMode: 'Always'
            };

            const helloSodaSession = await openapi_hellosoda_createSession(params.API_URL, params.API_TIMEOUT, params.jwtToken, { requestBody: sessionParams });
            if (helloSodaSession.status === 200) {
                helloSodaParams = {
                    sessionId: helloSodaSession.body
                };
            } else {
                return {
                    status: 403,
                    passToBackend: false,
                    responseBody: 'hello soda create session error'
                };
            }
        } else {
            helloSodaParams = {
                sessionId: params.req.body.sessionId
            };
        }



        if (helloSodaParams.sessionId !== undefined) {
            const fileAsBase64 = params.req.body.file;
            const base64Data = fileAsBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);


            if (base64Data !== null) {
                const fileData = base64Data[2];

                if (fileData !== undefined) {
                    const buf = Buffer.from(fileData, 'base64');
                    const form = new FormData();
                    form.append('file', buf, {
                        filename: `doc-${params.req.body.side}.jpg`,
                    });

                    const resp = await Axios.post(`${params.API_URL}/hellosoda/iddocumentverification/sessions/${helloSodaParams.sessionId}/document/${params.req.body.side}`,
                        form.getBuffer(), {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                ...(form.getHeaders()),
                                'Authorization': `Bearer ${params.jwtToken}`,
                            },
                            transformResponse: [],
                            validateStatus: () => true,
                            timeout: 60000,

                        }
                    );

                    const data = JSON.parse(resp.data);
                    const backSideRequired = data.hasOwnProperty('backSideRequired') === true;
                    const documentError = resp.status >= 400 && resp.status < 500 ;
                    const shouldEndSession =  !backSideRequired && !documentError;

                    if (shouldEndSession) {
                        await openapi_hellosoda_endSession(params.API_URL, params.API_TIMEOUT, params.jwtToken, { sessionId: helloSodaParams.sessionId });
                    }

                    if (resp.status >= 400) {
                        return {
                            status: 400,
                            passToBackend: false,
                            responseBody: data

                        };
                    }

                    const rawResponse: {backSideRequired: boolean}  = data;
                    return {
                        status: 200,
                        passToBackend: false,
                        responseBody: {
                            backSideRequired: data.hasOwnProperty('backSideRequired') === true ? rawResponse.backSideRequired : false,
                            sessionId: helloSodaParams.sessionId
                        }
                    };

                }
            }

        }


        return {
            status: 400,
            passToBackend: false,
            responseBody: 'unknown sessionId'
        };


    }
};
