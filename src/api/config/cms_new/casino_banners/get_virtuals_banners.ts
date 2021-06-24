import { openapi_website_cms_getVirtualsBanners, Response200Type, decodeResponse200 } from 'src/api_openapi/generated/openapi_website_cms_getVirtualsBanners';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

export type PromoNotificationsModelType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Array<PromoNotificationsModelType> => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const getVirtualsBanners = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/get-virtuals-banners',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/get-virtuals-banners',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

        const response = await openapi_website_cms_getVirtualsBanners(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE
        });

        return {
            passToBackend: false,
            status: response.status,
            responseBody: response.body
        };
    }
};
