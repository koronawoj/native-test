import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { GetVirtualGameType, decodeVirtualGame } from './getVirtualSportsDecode';

const decode = (status: number, data: ResponseType): GetVirtualGameType => {
    if (status === 200 && data.type === 'json') {
        return decodeVirtualGame(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface GetVirtualSportsParamsType {
    gameId: string;
};

export const getVirtualSports = {
    browser: {
        params: (params: GetVirtualSportsParamsType): ParamsFetchType<GetVirtualSportsParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/virtual-sports',
                body: params
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/virtual-sports',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<GetVirtualSportsParamsType>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/leap-virtual-sports/game-url/${params.req.body.gameId}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    },
};
