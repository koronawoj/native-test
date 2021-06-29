import axios, { CancelToken } from 'axios';

const TIMEOUT = 30 * 1000;

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const getAuthorization = (backendToken: string): Record<string, string> => ({
    'Authorization': `Bearer ${backendToken}`,
});

const getHeaders = (backendToken?: string, extraHeaders?: Record<string, string>): Record<string, string> => {
    const basicHeaders = ({
        ...defaultHeaders,
        ...(backendToken !== undefined ? getAuthorization(backendToken): {})
    });

    if (extraHeaders) {
        return {
            ...basicHeaders,
            ...extraHeaders
        };
    }

    return basicHeaders;
};

// export type FetchResponseBaseType = {
//     status: number,
//     bodyJson: unknown,
// } | {
//     status: number,
//     text: string,
// }

export type FetchResponseBaseType = {
    status: number,
};

type ParamsGeneralType = {
    url: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
    backendToken?: string,
    cancel?: Promise<void>
};

export type ParamsType<R extends FetchResponseBaseType> = ParamsGeneralType & {
    decode: (data: unknown) => R | Error,
};

export type ParamsWithoutTokenType<R extends FetchResponseBaseType> = Omit<ParamsType<R>, 'backendToken'>;


export interface FetchGeneralResponseType {
    status: number,
    body: string
}

const decodeResponseInner = async <R extends FetchResponseBaseType>(decode: (data: unknown) => R | Error, data: {status: number}): Promise<R> => {
    const result = decode(data);

    if (result instanceof Error) {
        return Promise.reject(result);
    }

    return result;
};

export const decodeResponse = <R extends FetchResponseBaseType>(resp: FetchGeneralResponseType, decode: (data: unknown) => R | Error): Promise<R> => {
    const text = resp.body;

    try {
        const dataToDecode = {
            status: resp.status,
            bodyJson: JSON.parse(text)
        };

        return decodeResponseInner(decode, dataToDecode);
    } catch (err) {
        const dataToDecode = {
            status: resp.status,
            text: text
        };

        return decodeResponseInner(decode, dataToDecode);
    }
};

const getCancelToken = (cancelPromise?: Promise<void>): CancelToken | undefined => {
    if (cancelPromise !== undefined) {
        return new axios.CancelToken((cancel) => {
            cancelPromise.then(() => {
                cancel();
            }).catch((err) => {
                console.error(err);
            })
        });
    }
};

export const fetchGeneral = async (method: 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE' | 'PUT', params: ParamsGeneralType): Promise<FetchGeneralResponseType> => {
    const { url, backendToken, body: bodyParam, extraHeaders } = params;

    if (typeof window === 'undefined') {
        console.info(`FETCH-API ${method} REQUEST ${url}`);
    }

    const resp = await axios.request({
        method: method,
        url: url,
        data: bodyParam === undefined ? undefined : JSON.stringify(bodyParam),
        headers: getHeaders(backendToken, extraHeaders),
        transformResponse: [],
        validateStatus: () => true,
        timeout: TIMEOUT,
        cancelToken: getCancelToken(params.cancel)
    });

    if (typeof window === 'undefined') {
        console.info(`FETCH-API ${method} RESPONSE ${url} status=${resp.status}`);
    }

    const respData = resp.data;

    if (typeof respData !== 'string') {
        console.error(respData);
        throw Error('String expected');
    }

    return {
        status: resp.status,
        body: respData
    }
};

export const fetchGet = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('GET', params);
    return decodeResponse(response, params.decode);
};

export const fetchHead = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('HEAD', params);
    return decodeResponse(response, params.decode);
};

export const fetchPost = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('POST', params);
    return decodeResponse(response, params.decode);
};

export const fetchPatch = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('PATCH', params);
    return decodeResponse(response, params.decode);
};

export const fetchDelete = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('DELETE', params);
    return decodeResponse(response, params.decode);
};

export const fetchPut = async <R extends FetchResponseBaseType>(params: ParamsType<R>): Promise<R> => {
    const response = await fetchGeneral('PUT', params);
    return decodeResponse(response, params.decode);
};
