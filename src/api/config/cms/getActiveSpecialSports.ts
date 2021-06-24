import { MethodType, GenerateUrlApiType, ResponseType, ParamsFetchType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_getActiveSpecialSports, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_getActiveSpecialSports';

export type ActiveSpecialSportsType = Response200Type extends Array<infer Model> ? Model : never;

export const getActiveSpecialSports = {
    browser: {
        params: (): ParamsFetchType<{}> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/active-special-sports',
            };
        },
        decode: (status: number, data: ResponseType): Response200Type  => {
            if (status === 200 && data.type === 'json') {
                return decodeResponse200(data.json);
            }

            throw new Error(`unhandled response ${status} - ${data.type}`);
        }
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/active-special-sports',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<{}>): Promise<GenerateUrlApiType> => {

        const resp = await openapi_website_cms_getActiveSpecialSports(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
