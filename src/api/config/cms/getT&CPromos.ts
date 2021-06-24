import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeGetTermsConditionCMS, GetPromoTermsConditionsCMSType } from './getT&CPromosDecode';

const decode = (status: number, data: ResponseType): GetPromoTermsConditionsCMSType => {
    if (status === 200 && data.type === 'json') {
        return decodeGetTermsConditionCMS(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface GetPromoSidebarParamsType {
    slug: string;
};

export const getPromoTermsConditions = {
    browser: {
        params: (params: GetPromoSidebarParamsType): ParamsFetchType<GetPromoSidebarParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/get-promo-terms-conditions',
                body: params
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/get-promo-terms-conditions',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<GetPromoSidebarParamsType>): Promise<GenerateUrlApiType> => {
        const { slug } = params.req.body;
        return {
            url: `${params.API_URL}/cms/pages/${params.API_UNIVERSE}/${slug}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    },
};
