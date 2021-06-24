import { MethodType, GenerateUrlApiType, ResponseType, ParamsFetchType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_postUserFavouritesSport, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_postUserFavouritesSport';

interface ParamsType {
    sport: Array<string>,
}

export type NavigationLinkItemType = Response200Type extends Array<infer Model> ? Model : never;

export const postUserFavouritesSport = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/cms/user-favourites-sport',
                body: params,
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
        method: MethodType.POST,
        urlBrowser: '/api-web/cms/user-favourites-sport',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {
        const userSessionId = params.userSessionId;
        const sport = params.req.body.sport;

        if (userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }
    
        const resp = await openapi_website_cms_postUserFavouritesSport(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            user_id: userSessionId,
            body: {
                sport,
            }
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
