import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { BannersDataModelType, decodeBannersDataModel } from 'src/api/config/liveCasino/getLiveCasinoBannerDecode';

const decode = (status: number, data: ResponseType): BannersDataModelType | null => {
    if (status === 200 && data.type === 'json') {
        return decodeBannersDataModel(data.json);
    }

    if (status === 400 && data.type === 'json') {
        return null;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getLiveCasinoBanner = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/pragmatic-casino/slides/active',
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/pragmatic-casino/slides/active'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/${params.API_UNIVERSE}/pragmatic-casino/slides/active`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
