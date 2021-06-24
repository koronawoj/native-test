import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { decodeNumber } from 'src/api/utils/commonModelValidators';
import { openapi_hellosoda_getFacebookRetries } from 'src/api_openapi/generated/openapi_hellosoda_getFacebookRetries';
import { openapi_hellosoda_getDocumentsRetries } from 'src/api_openapi/generated/openapi_hellosoda_getDocumentsRetries';

export const decodeVerifyCounterDataModel = buildModelValidator('verifyCounter data', {
    facebook: buildApiItemDefault(decodeNumber, 0),
    documentUpload: buildApiItemDefault(decodeNumber, 0),
});

export type VerifyCounterModelType = ReturnType<typeof decodeVerifyCounterDataModel>;

type SuccessResponseType = {
    type: 'success',
    body: VerifyCounterModelType
};


const decode = (status: number, data: ResponseType): SuccessResponseType   => {

    if (status === 200 && data.type === 'json' ) {
        return {
            type: 'success',
            body: decodeVerifyCounterDataModel(data.json)
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};



export const verifyCounter = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/user/profile-verification-counter',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/user/profile-verification-counter'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
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

        const counterParams = {
            universe: params.API_UNIVERSE,
            accountType: 'customer',
            accountId: userSessionId
        };

        const verifyCounterFacebook = await openapi_hellosoda_getFacebookRetries(params.API_URL, params.API_TIMEOUT, params.jwtToken, counterParams);

        const verifyCounterDocuments = await openapi_hellosoda_getDocumentsRetries(params.API_URL, params.API_TIMEOUT, params.jwtToken, counterParams);

        if (verifyCounterDocuments.status === 200 && verifyCounterFacebook.status === 200) {
            return {
                passToBackend: false,
                status: 200,
                responseBody: {
                    facebook: parseInt(verifyCounterFacebook.body),
                    documentUpload: parseInt(verifyCounterDocuments.body)
                }
            };

        } else {
            return {
                passToBackend: false,
                status: 400,
                responseBody: {
                    verifyCounterDocuments: verifyCounterDocuments.body,
                    verifyCounterFacebook: verifyCounterFacebook.body
                }
            };
        }

    }
};
