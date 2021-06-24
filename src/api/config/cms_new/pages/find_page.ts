import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_findPage, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_findPage';


export type TransactionItemType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Response200Type | null  => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    if (status === 404) {
        return null;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface PageType {
    slug: string,
    page_language: string
}

export interface PostPageType {
    page: PageType,
}

export const findPage = {
    browser: {
        params: (params: PageType): ParamsFetchType<PageType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/find-page',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/find-page',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<PageType>): Promise<GenerateUrlApiType> => {
        const resp = await openapi_website_cms_findPage(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            body: params.req.body
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body,
        };
    }
};
