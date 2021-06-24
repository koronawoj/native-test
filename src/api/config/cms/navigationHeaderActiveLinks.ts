import { MethodType, GenerateUrlApiType, ResponseType, ParamsFetchType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_getTopNavigationActiveLinks, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_getTopNavigationActiveLinks';

export type NavigationLinkItemType = Response200Type extends Array<infer Model> ? Model : never;
const decode = (status: number, data: ResponseType): Response200Type  => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const navigationHeaderLinksActive = {
    browser: {
        params: (): ParamsFetchType<{}> => {
            return {
                type: MethodType.POST,
                url: '/api-web/navigation-header/get-active-links',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/navigation-header/get-active-links',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {

        const resp = await openapi_website_cms_getTopNavigationActiveLinks(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
