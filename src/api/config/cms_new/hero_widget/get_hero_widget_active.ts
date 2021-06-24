import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_getHeroWidgetActive, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_getHeroWidgetActive';

export type HeroWidgetModelType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Array<HeroWidgetModelType> => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const get_hero_widget_active = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/get_hero_widget_active',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/get_hero_widget_active',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

        const response = await openapi_website_cms_getHeroWidgetActive(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE
        });

        return {
            passToBackend: false,
            status: response.status,
            responseBody: response.body
        };
    }
};
