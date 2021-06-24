import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { GetGameUriDataResponseType, decodeGameUriDataModel, decodeGameUriErrorModel } from 'src/api/config/liveCasino/getLiveCasinoGameUriDecode';
import qs from 'query-string';

export type GetLiveCasinoGamesUriResponseType = {
    type: 'ok',
    data: GetGameUriDataResponseType,
} | {
    type: 'access_error',
    message: string,
};

const decode = (status: number, data: ResponseType): GetLiveCasinoGamesUriResponseType => {
    if (status === 200 && data.type === 'json') {
        return {
            type: 'ok',
            data: decodeGameUriDataModel(data.json)
        };
    }

    if (status === 403 && data.type === 'json') {
        const dataDecoded = decodeGameUriErrorModel(data.json);
        return {
            type: 'access_error',
            message: dataDecoded.message
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface GetLiveCasinoGamesUriParamsType {
    gameId: string;
    technology: string;
    platform: string;
    language: string;
    webUrl: string;
    homeAddress: string;
};

export const getLiveCasinoGamesUri = {
    browser: {
        params: (params: GetLiveCasinoGamesUriParamsType): ParamsFetchType<GetLiveCasinoGamesUriParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/launch-live-casino-game',
                body: params
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/launch-live-casino-game',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<GetLiveCasinoGamesUriParamsType>): Promise<GenerateUrlApiType> => {

        const { gameId, technology, platform, language, webUrl, homeAddress } = params.req.body;
        const cashierUrl = `${webUrl}/?account=top-up`;
        const lobbyUrl = `${webUrl}/${homeAddress}`;

        const query = qs.stringify({
            gameId: gameId,
            technology: technology,
            platform: platform,
            language: language,
            cashierUrl: cashierUrl,
            lobbyUrl: lobbyUrl
        });

        return {
            url: `${params.API_URL}/${params.API_UNIVERSE}/pragmatic-casino/casino/games/launch/?${query}`,
            passToBackend: true,
            method: MethodType.PUT,
        };
    },
};
