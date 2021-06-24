import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): void => {
    if (status === 200 && data.type === 'json') {
        if (data.json === 'OK') {
            return;
        }
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface ParamsType {
    gameId: number,
    rating: number,
}

export const casinoSetRating = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<void> => {
            const { gameId, rating } = params;

            return {
                type: MethodType.POST,
                url: `/api/casino/live-games/rating/${gameId}?q=${rating}`              //TODO
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/casino/set-rating',
    },
    generateUrlApi: async (_params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: 'TODO',
            passToBackend: true,
            method: MethodType.GET
        };
    }
};


