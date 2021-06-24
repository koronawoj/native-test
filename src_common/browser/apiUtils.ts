import { fetchPost, fetchGet, fetchDelete, fetchPatch, fetchHead, fetchPut } from '@twoupdigital/realtime-server/libjs/fetch';
import { fetchGeneralRaw } from 'src_common/common/fetch';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { assertNever } from '@twoupdigital/mobx-utils/libjs/assertNever';

export interface ExpressRequest<B> {
    params: Record<keyof B, string>,     //From url params
    body: B,
    connection: {
        remoteAddress?: string | undefined
    },
}

export enum MethodType {
    POST = 'POST',
    GET = 'GET',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    PUT = 'PUT'
}

export type ParamsFetchType<B> = {
    type: MethodType,
    url: string,
    body?: B;
};

export type GenerateUrlApiType<B = unknown> = {
    passToBackend: true,
    method: MethodType,
    url: string,
    backendToken?: string,                              //TODO - to remove
    headers?: Record<string, string> | undefined,
    body?: B,
    cookie?: {
        key: string,
        value: string
    }
} | {
    passToBackend: false,
    status: number,
    responseBody: unknown,
    headers?: Record<string, string>,
    cookie?: {
        key: string,
        value: string
    }
};

export type ResponseType = {
    type: 'json',
    json: unknown,
} | {
    type: 'text',
    text: string,
};

const jsonParse = (body: string): ResponseType => {
    try {
        const bodyJson = JSON.parse(body);

        return {
            type: 'json',
            json: bodyJson,
        };
    } catch (err) {
        return {
            type: 'text',
            text: body,
        };
    }
};

export interface WebApiDriverItem<P, B, R> {
    run: (params: P) => Promise<R>,
    express: {
        method: MethodType,
        urlBrowser: string;
    },
    generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType>
}

export interface WebApiDriverItemConfig<P, B, R> {
    browser: {
        params: (params: P) => ParamsFetchType<B>,
        decode: (status: number, data: ResponseType) => R,
    },
    express: {
        method: MethodType,
        urlBrowser: string;
    },
    generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType>
}

export const createWebApiDriverItem = <P, B, R>(item: WebApiDriverItemConfig<P, B, R>): WebApiDriverItem<P, B, R> => {
    const generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType> = item.generateUrlApi;

    // tslint:disable-next-line
    if (typeof window === 'undefined') {
        return {
            run: async (): Promise<R> => {
                return new Promise(() => {});
            },
            express: item.express,
            generateUrlApi: generateUrlApi,
        };
    }

    return {
        run: async (params: P): Promise<R> => {

            const config = item.browser.params(params);
            const decode = item.browser.decode;

            const response = await fetchGeneralRaw(config.type, {
                url: config.url,
                body: config.body,
                timeout: 'default',
            });

            const parsedResponse = jsonParse(response.body);
            return decode(response.status, parsedResponse);
        },
        express: item.express,
        generateUrlApi: generateUrlApi,
    };
};

/**
 * @deprecated
 */
export interface WebApiDriverItemBaseOld<P, B, R extends {status: number;}> {
    browser: {
        params: (params: P) => ParamsFetchType<B>,
        decode: (data: unknown) => R | Error;
    },
    express: {
        method: MethodType,
        urlBrowser: string;
    },
    generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType>
}

/**
 * @deprecated
 */
export const createWebApiDriverItemOld = <P, B, R extends {status: number;}>(item: WebApiDriverItemBaseOld<P, B, R>): WebApiDriverItem<P, B, R> => {
    const generateUrlApi: (params: GenerateUrlApiParamsType<B>) => Promise<GenerateUrlApiType> = item.generateUrlApi;

    // tslint:disable-next-line
    if (typeof window === 'undefined') {
        return {
            run: async (): Promise<R> => {
                return new Promise(() => {});
            },
            express: item.express,
            generateUrlApi: generateUrlApi,
        };
    }

    return {
        run: async (params: P): Promise<R> => {

            const config = item.browser.params(params);
            const decode = item.browser.decode;

            const reqConfig = {
                url: config.url,
                decode,
                body: config.body
            };

            if (config.type === MethodType.POST) {
                return fetchPost(reqConfig);
            } else if (config.type === MethodType.GET) {
                return fetchGet(reqConfig);
            } else if (config.type === MethodType.DELETE) {
                return fetchDelete(reqConfig);
            } else if (config.type === MethodType.PATCH) {
                return fetchPatch(reqConfig);
            } else if (config.type === MethodType.HEAD) {
                return fetchHead(reqConfig);
            } else if (config.type === MethodType.PUT) {
                return fetchPut(reqConfig);
            }
            assertNever('MethodType', config.type);
        },
        express: item.express,
        generateUrlApi: generateUrlApi,
    };
};
