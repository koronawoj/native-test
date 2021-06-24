import { MethodType, ExpressRequest, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import express from 'express';
import { fetchGeneral, fetchPost, fetchGet, FetchResponseBaseType, ParamsWithoutTokenType } from '@twoupdigital/realtime-server/libjs/fetch';
import { fetchGeneralRaw } from 'src_common/common/fetch';
import { assertNever } from '@twoupdigital/mobx-utils/libjs/assertNever';
import { getJwt } from '@twoupdigital/realtime-server/libjs/PlatformApi/GetJwt';
import { UniverseType } from 'src_common/common/universe';
import { createErrorMessageFromNodejs, HandlerType, wrapAsync } from './wrapAsync';
import { createAnonymousSession } from 'src_common/server/api/createAnonymousSession';
import { getSessionFromToken } from './getSessionFromToken';
import { openApiFormatLog } from './logFormat';
import bodyParser from 'body-parser';

interface JsonParserConfigType {
    limit: string,
}

interface WebApiDriverItem<B> {
    express: {
        method: MethodType,
        urlBrowser: string;
    },
    generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType>
}

export interface ConfigItemType {
    method: 'post' | 'get' | 'delete' | 'patch',
    urlBrowser: string,
    generateUrlApi: (req: express.Request) => string;
}

export interface GenerateUrlApiParamsType<B> {
    req: ExpressRequest<B>,
    API_URL: string,
    API_UNIVERSE: UniverseType,
    API_TIMEOUT: number,
    POSTCODEANYWHERE_KEY: string,
    userSessionId: number | null,
    sessionIdDB: string,
    accountType: string,
    jwtToken: string,
    cookieName: string,
    getHeader: (name: string) => string | undefined,
    fetchGet: <R extends FetchResponseBaseType>(params: ParamsWithoutTokenType<R>) => Promise<R>,
    fetchPost: <R extends FetchResponseBaseType>(params: ParamsWithoutTokenType<R>) => Promise<R>,
}

export interface GenerateUrlApiParamsWithSessionIdType {
    API_URL: string;
    API_UNIVERSE: UniverseType;
    userSessionId: number;
    jwtToken: string | undefined;
}

function createFetchReqOldForDelete(cookieName: string, configItem: ConfigItemType, type: 'GET' | 'POST' | 'DELETE' | 'PATCH'): express.RequestHandler {
    return wrapAsync(async (req: express.Request, res: express.Response) => {
        const response = await fetchGeneral(type, {
            url: configItem.generateUrlApi(req),
            body: req.body,
            backendToken: getJwt(req, cookieName)
        });
        res.status(response.status).send(response.body);
    });
}

function applyConfigItem(cookieName: string, app: express.Application, configItem: ConfigItemType): void {
    const urlBrowser = configItem.urlBrowser;
    switch (configItem.method) {
    case 'get':
        app.get(
            urlBrowser,
            createFetchReqOldForDelete(cookieName, configItem, 'GET')
        );
        return;
    case 'post':
        app.post(
            urlBrowser,
            createFetchReqOldForDelete(cookieName, configItem, 'POST')
        );
        return;
    case 'delete':
        app.delete(
            urlBrowser,
            createFetchReqOldForDelete(cookieName, configItem, 'DELETE')
        );
        return;
    case 'patch':
        app.patch(
            urlBrowser,
            createFetchReqOldForDelete(cookieName, configItem, 'PATCH')
        );
        return;
    }
    assertNever('applyConfig', configItem.method);

}

/**
 * @deprecated - this is the old way of installing handlers
 */
export const applyConfigOldForDelete = (cookieName: string, app: express.Application, config: Array<ConfigItemType>): void => {
    for (const configItem of config) {
        applyConfigItem(cookieName, app, configItem);
    }
};




// ---------------------------------------------------------

const getJwtToken = async (
    cookieName: string,
    req: express.Request,
    res: express.Response,
    API_URL: string,
    API_TIMEOUT: number,
    API_UNIVERSE: UniverseType
): Promise<string | null> => {
    const jwtToken = getJwt(req, cookieName);

    if (jwtToken !== undefined) {
        return jwtToken;
    }

    const token = await createAnonymousSession(API_URL, API_TIMEOUT, API_UNIVERSE);

    if (token === null) {
        const body = createErrorMessageFromNodejs('Problem with creating an anonymous session');
        res.status(500).send(body);
        return null;
    }

    res.cookie(cookieName, token);
    return token;
};

interface ConfigForExpressParamsType {
    jsonParser: null | JsonParserConfigType,
    app: express.Application,
    cookieName: string,
    API_URL: string,
    API_UNIVERSE: UniverseType,
    API_TIMEOUT: number,
    POSTCODEANYWHERE_KEY: string,
}

function createFetchReq<B>(
    config: ConfigForExpressParamsType,
    item: WebApiDriverItem<B>,
): HandlerType {
    const { cookieName, API_URL, API_UNIVERSE, API_TIMEOUT, POSTCODEANYWHERE_KEY } = config;

    return wrapAsync(async (req: express.Request, res: express.Response) => {
        res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');

        const jwtToken = await getJwtToken(cookieName, req, res, API_URL, API_TIMEOUT, API_UNIVERSE);
        if (jwtToken === null) {
            return;
        }

        const session = getSessionFromToken(jwtToken);

        if (session === null) {
            const body = createErrorMessageFromNodejs('Incorrect data in jwtToken');
            res.status(400).send(body);
            return;
        }

        const getHeader = (name: string): string | undefined => {
            //@ts-expect-error
            return req.headers[name];
        };

        //@ts-expect-error
        const reqParams: ExpressRequest<B> = req;

        const params: GenerateUrlApiParamsType<B> = {
            req: reqParams,
            API_URL,
            API_UNIVERSE,
            API_TIMEOUT,
            POSTCODEANYWHERE_KEY,
            userSessionId: session.userId,
            sessionIdDB: session.sessionIdDB,
            accountType: session.accountType,
            jwtToken,
            cookieName,
            getHeader,
            fetchGet: <R extends FetchResponseBaseType>(params: ParamsWithoutTokenType<R>): Promise<R> => {
                const timeMarker = openApiFormatLog('TODO TO OPENAPI 2 - Request to replace -->', {
                    method: 'GET',
                    url: params.url,
                    body: params.body
                });

                return fetchGet({
                    ...params,
                    backendToken: jwtToken
                }).then((response) => {
                    timeMarker.show(response.status);
                    return response;
                });
            },
            fetchPost: <R extends FetchResponseBaseType>(params: ParamsWithoutTokenType<R>): Promise<R> => {
                const timeMarker = openApiFormatLog('TODO TO OPENAPI 2 - Request to replace -->', {
                    method: 'POST',
                    url: params.url,
                    body: params.body
                });

                return fetchPost({
                    ...params,
                    backendToken: jwtToken
                }).then((response) => {
                    timeMarker.show(response.status);
                    return response;
                });
            }
        };

        const dataToBackend = await item.generateUrlApi(params);

        if (dataToBackend.cookie !== undefined) {
            res.cookie(dataToBackend.cookie.key, dataToBackend.cookie.value);
        }

        if (dataToBackend.passToBackend) {
            const timeMarker = openApiFormatLog('TODO TO OPENAPI 3 - Request to replace -->', {
                method: dataToBackend.method,
                url: dataToBackend.url,
                body: dataToBackend.body
            });

            const body = dataToBackend.body ?? req.body;

            const response = await fetchGeneralRaw(dataToBackend.method, {
                url: dataToBackend.url,
                extraHeaders: dataToBackend.headers,
                body: body,
                backendToken: dataToBackend.backendToken ?? jwtToken,
                timeout: API_TIMEOUT,
            });

            timeMarker.show(response.status);

            res.status(response.status).send(response.body);
        } else {
            res.status(dataToBackend.status);
            const headers = dataToBackend.headers;
            if (headers !== undefined) {
                for (const [name, value] of Object.entries(headers)) {
                    res.setHeader(name, value);
                }
            }
            res.send(dataToBackend.responseBody);
        }
    });
}

const installHandler = (
    app: express.Application,
    method: MethodType,
    urlBrowser: string,
    expressHandler: HandlerType
): void => {
    if (method === MethodType.GET) {
        app.get(urlBrowser, expressHandler);
        return;
    } else if (method === MethodType.POST) {
        app.post(urlBrowser, expressHandler);
        return;
    } else if (method === MethodType.DELETE) {
        app.delete(urlBrowser, expressHandler);
        return;
    } else if (method === MethodType.PATCH) {
        app.patch(urlBrowser, expressHandler);
        return;
    } else if (method === MethodType.PUT) {
        app.put(urlBrowser, expressHandler);
        return;
    } else if (method === MethodType.HEAD) {
        app.head(urlBrowser, expressHandler);
        return;
    }
    assertNever('applyConfig', method);
};

const installHandlerWithJsonParser = (
    app: express.Application,
    method: MethodType,
    urlBrowser: string,
    expressHandler: HandlerType,
    jsonParserConfig: JsonParserConfigType
): void => {
    const jsonParser = bodyParser.json(jsonParserConfig);

    if (method === MethodType.GET) {
        app.get(urlBrowser, jsonParser, expressHandler);
        return;
    } else if (method === MethodType.POST) {
        app.post(urlBrowser, jsonParser, expressHandler);
        return;
    } else if (method === MethodType.DELETE) {
        app.delete(urlBrowser, jsonParser, expressHandler);
        return;
    } else if (method === MethodType.PATCH) {
        app.patch(urlBrowser, jsonParser, expressHandler);
        return;
    } else if (method === MethodType.PUT) {
        app.put(urlBrowser, jsonParser, expressHandler);
        return;
    } else if (method === MethodType.HEAD) {
        app.head(urlBrowser, jsonParser, expressHandler);
        return;
    }
    assertNever('applyConfig', method);
};

const createItem = <B>(params: ConfigForExpressParamsType, configItem: WebApiDriverItem<B>): void => {
    const jsonParser = params.jsonParser;
    const app = params.app;
    const method = configItem.express.method;
    const urlBrowser = configItem.express.urlBrowser;
    const expressHandler = createFetchReq(params, configItem);

    if (jsonParser !== null) {
        installHandlerWithJsonParser(app, method, urlBrowser, expressHandler, jsonParser);
    } else {
        installHandler(app, method, urlBrowser, expressHandler);
    }
};

export const applyConfigForExpress = <T extends Record<string, WebApiDriverItem<never>>>(
    params: ConfigForExpressParamsType,
    config: T
): void => {
    for (const configItem of Object.values(config)) {
        createItem(params, configItem);
    }
};
