import axios, { CancelToken } from 'axios';
import { JsonDataType, jsonParse } from './jsonParse';

const DEFAULT_TIMEOUT = 60 * 1000;

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

type ParamsGeneralType = {
    url: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
    backendToken?: string,
    cancel?: Promise<void>,
    /**
     * Timeout in seconds
     */
    timeout: number | 'default',
};

export interface FetchGeneralRawResponseType {
    status: number,
    body: string
}

const getCancelToken = (cancelPromise?: Promise<void>): CancelToken | undefined => {
    if (cancelPromise !== undefined) {
        return new axios.CancelToken((cancel) => {
            cancelPromise.then(() => {
                cancel();
            }).catch((err) => {
                console.error(err);
            });
        });
    }
};

//time in miliseconds
const getTime = (): number => new Date().getTime();

type MethodType = 'GET' | 'HEAD' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export const fetchGeneralRaw = async (method: MethodType, params: ParamsGeneralType): Promise<FetchGeneralRawResponseType> => {
    const { url, backendToken, body: bodyParam, extraHeaders, timeout } = params;

    const timeStart = getTime();

    const resp = await axios.request({
        method: method,
        url: url,
        data: bodyParam === undefined ? undefined : JSON.stringify(bodyParam),
        headers: getHeaders(backendToken, extraHeaders),
        transformResponse: [],
        validateStatus: () => true,
        timeout: timeout === 'default' ? DEFAULT_TIMEOUT : timeout * 1000,
        cancelToken: getCancelToken(params.cancel)
    });

    // tslint:disable-next-line
    if (typeof window === 'undefined') {
        const timeExec = getTime() - timeStart;

        const message = `UTILS FETCH-API ${method} RESPONSE ${url} status=${resp.status} in ${timeExec}ms`;

        if (resp.status >= 500) {
            console.error(message);
        } if (resp.status >= 400) {
            console.warn(message);
        } else {
            console.info(message);
        }
    }

    const respData = resp.data;

    if (typeof respData !== 'string') {
        console.error(respData);
        throw Error('String expected');
    }

    return {
        status: resp.status,
        body: respData
    };
};

export interface FetchGeneralResponseType {
    status: number,
    body: JsonDataType
}
 
export const fetchGeneral = async (method: MethodType, params: ParamsGeneralType): Promise<FetchGeneralResponseType> => {
    const response = await fetchGeneralRaw(method, params);
    const bodyJson = jsonParse(response.body);
    return {
        status: response.status,
        body: bodyJson
    };
};

