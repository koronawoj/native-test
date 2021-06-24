import { GetPopularSportsType, decodePopularSportsArray } from './getPopularSportsDecode';
import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): GetPopularSportsType | null => {
    if (status === 200 && data.type === 'json') {
        return decodePopularSportsArray(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface GetPopularSportsParamsType {
    abTestGroup: string;
}

export const getPopularSports = {
    browser: {
        params: (params: GetPopularSportsParamsType): ParamsFetchType<GetPopularSportsParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/recommendations/sports/popular',
                body: params
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/recommendations/sports/popular',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<GetPopularSportsParamsType>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/recommendations/sports/popular/${params.API_UNIVERSE}?ab_test_group=${params.req.body.abTestGroup}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    },
};
