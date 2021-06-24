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
    favourite: boolean,
}

export const casinoSetFavourite = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<void> => {
            const { gameId, favourite } = params;

            return {
                type: MethodType.POST,
                //url: `/api-web/casino/set-favourite`,                            //TODO
                //url: `/api/casino/live-games/favourite/182047?q=false`
                url: `/api/casino/live-games/favourite/${gameId}?q=${favourite ? 'true' : 'false'}`
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/casino/set-favourite',
    },
    generateUrlApi: async (_params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: 'TODO',
            passToBackend: true,
            method: MethodType.GET
        };
    }
};


