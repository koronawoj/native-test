import { GenerateUrlApiType, MethodType, ParamsFetchType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number): void => {
    if (status === 200 || status === 201) {
        return;
    }
    throw new Error(`unhandled response ${status}`);
};

interface ProfileVerificationParamsType {
    token: string
}

export const verifyProfileViaFacebook = {
    browser: {
        params: (params: ProfileVerificationParamsType): ParamsFetchType<ProfileVerificationParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/profile-verification',
                body: params,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/profile-verification'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ProfileVerificationParamsType>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }
        const { token } = params.req.body;

        return {
            url: `${params.API_URL}/hellosoda/profileverification/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                'facebook': token
            }
        };
    }
};

