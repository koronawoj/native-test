import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import * as t from 'io-ts';

const Error400IO = t.interface({
    error: t.string,
    error_description: t.string
});

type Error400Type = t.TypeOf<typeof Error400IO>;

const decodeError400 = buildValidator('ErrorIO', Error400IO);


const Error403IO = t.interface({
    debug: t.interface({
        code: t.string,         //      t.literal('reset_password_require'),
        details: t.unknown,
        message: t.string,
    }),
    errors: t.unknown,
    status: t.literal('error'),
});

type Error403Type = t.TypeOf<typeof Error403IO>;

const decodeError403 = buildValidator('ErrorIO', Error403IO);


export const LoginIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.interface({
            access_token: t.string,
        }),
    }),
    t.interface({
        status: t.literal(201),
        bodyJson: t.interface({
            access_token: t.string,
        }),
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({
            error: t.string,
            error_description: t.string
        }),
    }),
    t.interface({
        status: t.literal(403),
        bodyJson: t.interface({
            debug: t.interface({
                code: t.string,
                details: t.unknown,
                message: t.string,
            }),
            errors: t.unknown,
            status: t.literal('error'),
        }),
    })
]);

export type LoginSessionType = t.TypeOf<typeof LoginIO>
const createSession = async (
    params: GenerateUrlApiParamsType<LoginParams>,
    api_url: string,
    api_universe: string,
    api_username: string,
    api_password: string,
    role: string,
    xForwardedFor: string | null,
): Promise<LoginSessionType> => {
    const decodeLoginIO = buildValidator('LoginIOCostumer', LoginIO, true);

    const extraHeaders: Record<string, string> = xForwardedFor === null ? {} : {
        'x-forwarded-for': xForwardedFor
    };

    const sessionResponse = await params.fetchPost({
        url: `${api_url}/sessions/${api_universe}/${role}`,
        body: {
            username: api_username,
            password: api_password,
            grant_type: 'password',
        },
        extraHeaders: extraHeaders,
        decode: decodeLoginIO,
    });

    return sessionResponse;
};


const sendRequest = async (params: GenerateUrlApiParamsType<LoginParams>, xForwardedFor: string | null): Promise<GenerateUrlApiType> => {
    const accessTokenResponse = await createSession(
        params,
        params.API_URL,
        params.API_UNIVERSE,
        params.req.body.email,
        params.req.body.password,
        'customer',
        xForwardedFor
    );

    if (accessTokenResponse.status === 201 || accessTokenResponse.status === 200) {
        return {
            passToBackend: false,
            status: accessTokenResponse.status,
            responseBody: accessTokenResponse.bodyJson,
            cookie: {
                key: 'website.sid',
                value: accessTokenResponse.bodyJson.access_token
            }
        };
    }

    return {
        passToBackend: false,
        status: accessTokenResponse.status,
        responseBody: accessTokenResponse.bodyJson,
    };
};

interface LoginParams {
    email: string,
    password: string,
    disable_geo?: true,
}

export type LoginResponseType = {
    type: 'ok'
} | {
    type: 'errors',
    errors: Error400Type
} | {
    type: 'error_access'
    errors: Error403Type,
};

const decode = (status: number, data: ResponseType): LoginResponseType => {
    if (status === 200 || status === 201) {
        return {
            type: 'ok'
        };
    }

    if (status === 400 && data.type === 'json') {
        const decodedDataJson = decodeError400(data.json);

        if (decodedDataJson instanceof Error) {
            throw decodedDataJson;
        }

        return {
            type: 'errors',
            errors: decodedDataJson
        };
    }

    if (status === 403 && data.type === 'json') {
        const decodedDataJson = decodeError403(data.json);

        if (decodedDataJson instanceof Error) {
            throw decodedDataJson;
        }

        return {
            type: 'error_access',
            errors: decodedDataJson
        };
    }

    throw new Error(`unhandled response ${status}`);
};

export const loginRequest = {
    browser: {
        params: (params: LoginParams): ParamsFetchType<LoginParams> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/session',
                body: params
            };
        },
        decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/session',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<LoginParams>): Promise<GenerateUrlApiType> => {
        const disable_geo = params.req.body.disable_geo;

        if (disable_geo === true) {
            return await sendRequest(params, null);
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

        return await sendRequest(params, xForwardedFor);
    },
};
