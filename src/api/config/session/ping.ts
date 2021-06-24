import { fetchGeneral } from 'src_common/common/fetch';
import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { createAnonymousSession } from 'src_common/server/api/createAnonymousSession';
import { regenerateSession } from 'src_common/server/api/regenerateSession';
import { createGuard } from 'src_common/common/createGuard';
import * as t from 'io-ts';

const SessionIO = t.interface({
    deletedAt: t.union([t.string, t.null, t.undefined]),
});

const isSessionObject = createGuard(SessionIO);

const decode = (status: number, data: ResponseType): boolean | Error => {
    if (status === 200) {
        return true;
    }

    if (status === 201) {
        return true;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const ping = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: `/api-web/session/ping?${Date.now()}`,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/session/ping'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

        const jwtToken = params.jwtToken;
        const accountType = params.accountType;
        const sessionIdDB = params.sessionIdDB;
        const cookieName = params.cookieName;

        const response = await fetchGeneral('GET', {
            url: `${params.API_URL}/sessions/${params.API_UNIVERSE}/${accountType}/${sessionIdDB}`,
            backendToken: jwtToken,
            body: {
                markActive: true
            },
            timeout: params.API_TIMEOUT,
        });

        if (response.status === 200 && response.body.type === 'json' && isSessionObject(response.body.json)) {
            const deletedAt = response.body.json.deletedAt ?? null;
            const sessionIsFresh = deletedAt === null;

            if (sessionIsFresh) {
                if (accountType === 'anonymous') {
                    return {
                        passToBackend: false,
                        status: 200,
                        responseBody: JSON.stringify({
                            message: 'anonymous session ok',
                        })
                    };
                } else {
                    const newToken = await regenerateSession(params.API_URL, params.API_TIMEOUT, params.API_UNIVERSE, accountType, jwtToken);

                    if (newToken === null) {
                        return {
                            passToBackend: false,
                            status: 500,
                            responseBody: JSON.stringify({
                                message: 'Problem with regenerate this session',
                            })
                        };
                    }

                    return {
                        passToBackend: false,
                        status: 200,
                        responseBody: JSON.stringify({
                            message: 'Session was regenerate',
                        }),
                        cookie: {
                            key: cookieName,
                            value: newToken
                        }
                    };
                }
            }
        }
    
        const token = await createAnonymousSession(params.API_URL, params.API_TIMEOUT, params.API_UNIVERSE);

        if (token === null) {
            return {
                passToBackend: false,
                status: 500,
                responseBody: JSON.stringify({
                    message: 'Problem with creating an anonymous session',
                })
            };
        }

        return {
            passToBackend: false,
            status: 201,
            responseBody: JSON.stringify({
                message: 'anonymous session was created',
            }),
            cookie: {
                key: cookieName,
                value: token
            }
        };
    }
};
