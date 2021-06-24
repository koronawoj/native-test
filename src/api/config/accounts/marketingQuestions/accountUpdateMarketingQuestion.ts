import { GenerateUrlApiType, MethodType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import {
    decodeUpdateMarketingQuestionsResponseModel,
    UpdateMarketingQuestionsResponseType
} from './types';
import { QuestionAnswers } from 'src/universes/star/ui/account/PreferencesTab/types';

const decode = (status: number, data: ResponseType): UpdateMarketingQuestionsResponseType => {
    if (status === 200 && data.type === 'json') {
        return decodeUpdateMarketingQuestionsResponseModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


interface InnerBody {
    answers: QuestionAnswers
}

export const accountUpdateMarketingQuestion = {
    browser: {
        params: (answers: QuestionAnswers): ParamsFetchType<InnerBody> => {
            return {
                type: MethodType.PATCH,
                url: '/api-web/cms/marketing-questions',
                body: {
                    answers: answers
                }
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.PATCH,
        urlBrowser: '/api-web/cms/marketing-questions',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBody>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const { answers } = params.req.body;
        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.PATCH,
            body: {
                marketingQuestionsAnswers: answers
            }
        };
    }
};
