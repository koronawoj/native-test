import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { GetLiveCasinoGamesResponseType, decodeLiveCasinoGamesModel } from './getLiveCasinoGamesDecode';

const decode = (status: number, data: ResponseType): GetLiveCasinoGamesResponseType => {
    if (status === 200 && data.type === 'json') {
        return decodeLiveCasinoGamesModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getLiveCasinoGames = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.POST,
                url: '/api-web/live-casino'
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/live-casino',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/${params.API_UNIVERSE}/pragmatic-casino/casino/games/for-player`,
            passToBackend: true,
            method: MethodType.GET,
        };
    },
};
