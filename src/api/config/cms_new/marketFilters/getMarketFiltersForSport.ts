import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_website_cms_getMarketFiltersForSport, decodeResponse200, Response200Type } from 'src/api_openapi/generated/openapi_website_cms_getMarketFiltersForSport';

export type MarketFiltersForSportType = Response200Type extends Array<infer Model> ? Model : never;

const decode = (status: number, data: ResponseType): Array<MarketFiltersForSportType> => {
    if (status === 200 && data.type === 'json') {
        return decodeResponse200(data.json);
    }
    if (status === 404 || status === 500) {
        return [];
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface ParamsType {
    sport: string,
}

export const getMarketFiltersForSport = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/get-market-filters-for-sport',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/get-market-filters-for-sport',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {

        const response = await openapi_website_cms_getMarketFiltersForSport(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            sport: params.req.body.sport
        });

        return {
            passToBackend: false,
            status: response.status,
            responseBody: response.body
        };
    }
};
