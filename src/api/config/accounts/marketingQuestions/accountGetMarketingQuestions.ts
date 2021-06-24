import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import {
    decodeMarketingQuestionsArrayModel,
    MarketingQuestionsArrayType
} from './types';

const decode = (status: number, data: ResponseType): MarketingQuestionsArrayType => {
    if (status === 200 && data.type === 'json') {
        return decodeMarketingQuestionsArrayModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const accountGetMarketingQuestions = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/marketing-questions'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/marketing-questions',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/marketing-questions/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
