import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { fetchGeneral } from 'src_common/common/fetch';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { createGuard } from 'src_common/common/createGuard';
import * as t from 'io-ts';

type LogoutResponse = {
    type: 'ok'
};

const decode = (status: number, data: ResponseType): LogoutResponse  => {
    if (status === 200 || status === 201) {
        return {
            type: 'ok'
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

const LoginIO = t.interface({
    access_token: t.string,
});

type LoginSessionType = t.TypeOf<typeof LoginIO>;

const isLogin = createGuard(LoginIO);

const createSession = async (
    api_url: string,
    api_universe: string,
    API_TIMEOUT: number,
): Promise<LoginSessionType> => {
    const response = await fetchGeneral('POST', {
        url: `${api_url}/sessions/${api_universe}/anonymous`,
        body: {
            username: 'anonymous',
            password: 'anonymous',
            grant_type: 'password',
        },
        timeout: API_TIMEOUT,
    });

    if (response.status === 200 || response.status === 201) {
        if (response.body.type === 'json') {
            if (isLogin(response.body.json)) {
                return response.body.json;
            }
        }

        throw Error('Decode error');
    }

    throw Error(`Unexpected http response ${response.status}`);
};

const deleteSession = async (
    api_url: string,
    api_universe: string,
    accountType: string,
    sessionIdDB: string,
    API_TIMEOUT: number,
): Promise<void> => {
    await fetchGeneral('DELETE', {
        url: `${api_url}/sessions/${api_universe}/${accountType}/${sessionIdDB}`,
        timeout: API_TIMEOUT,
    });

    return;
};



export const logoutRequest = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.DELETE,
                url: '/api-web/sessions'
            };
        },
        decode: decode
    },

    express: {
        method: MethodType.DELETE,
        urlBrowser: '/api-web/sessions',
    },

    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        await deleteSession(
            params.API_URL,
            params.API_UNIVERSE,
            params.accountType,
            params.sessionIdDB,
            params.API_TIMEOUT,
        );

        const accessTokenResponse = await createSession(
            params.API_URL,
            params.API_UNIVERSE,
            params.API_TIMEOUT,
        );

        return {
            passToBackend: false,
            status: 200,
            responseBody: '',
            cookie: {
                key: 'website.sid',
                value: accessTokenResponse.access_token
            }
        };

    }

};
