import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeStaticPagesDataModel, StaticPageDataModelType } from './getStaticPageCMSDecode';

const decode = (status: number, data: ResponseType): StaticPageDataModelType | null => {
    if (status === 200 && data.type === 'json') {
        return decodeStaticPagesDataModel(data.json);
    }

    if (status === 404) {
        return null;
    }

    throw Error(`StaticPageDataCMSModelType - Incorrect response code ${status}`);
};

interface StaticPagesDataCMSParamsType {
    pageId: string,
    language: string | undefined
}

type InnerBody = StaticPagesDataCMSParamsType;

const getStaticPagesEndpoint = (pageId: string, _language: string | undefined):string => {
    // DO NOT REMOVE FOR NOW
    // return language !== undefined ? `${language}/${pageId}` : `${pageId}`;
    return `${pageId}`;

};

export const staticPagesDataCMS = {
    browser: {
        params: (params:StaticPagesDataCMSParamsType): ParamsFetchType<InnerBody> => {
            const endpoint = getStaticPagesEndpoint(params.pageId, params.language);
            return {
                type: MethodType.GET,
                url: `/api-web/cms/static-pages/${endpoint}`,
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/static-pages/:language?/:pageId',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBody>): Promise<GenerateUrlApiType> => {
        const pageId = params.req.params.pageId;
        const language = params.req.params.language;

        const endpoint = getStaticPagesEndpoint(pageId, language);
        return {
            url: `${params.API_URL}/cms/pages/${params.API_UNIVERSE}/${endpoint}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
