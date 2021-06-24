import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { GetLiveCasinoGamesCategoriesResponseType, decodeLiveCasinoGamesCategoriesModel } from 'src/api/config/liveCasino/getLiveCasinoCategoriesDecode';

const decode = (status: number, data: ResponseType): GetLiveCasinoGamesCategoriesResponseType => {
    if (status === 200 && data.type === 'json') {
        return decodeLiveCasinoGamesCategoriesModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getLiveCasinoCategories = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/live-casino-games-categories'
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/live-casino-games-categories',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/${params.API_UNIVERSE}/pragmatic-casino/casino/categories`,
            passToBackend: true,
            method: MethodType.GET,
        };
    },
};
