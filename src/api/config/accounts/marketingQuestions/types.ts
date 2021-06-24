import {buildApiItemDefault, buildArrayDecoderModel, buildModelValidator} from "src/api/utils/modelUtils";
import {decodeBoolean, decodeString, decodeStringArr} from "src/api/utils/commonModelValidators";
import {decodeAccountBasicDataModel} from "src/api/config/accounts/accountBasicDataDecode";

const MarketingQuestionModelConfig = {
    id: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
    possibleAnswers: buildApiItemDefault(decodeStringArr, []),
    active: buildApiItemDefault(decodeBoolean, false),
    fileName: buildApiItemDefault(decodeString, ''),
    uploadedAt: buildApiItemDefault(decodeString, ''),
};
export const decodeMarketingQuestionModel = buildModelValidator('MarketingQuestion', MarketingQuestionModelConfig);
export type MarketingQuestionType = ReturnType<typeof decodeMarketingQuestionModel>;

export const decodeMarketingQuestionsArrayModel = buildArrayDecoderModel(decodeMarketingQuestionModel);
export type MarketingQuestionsArrayType = ReturnType<typeof decodeMarketingQuestionsArrayModel>;

export const decodeUpdateMarketingQuestionsResponseModel = decodeAccountBasicDataModel;
export type UpdateMarketingQuestionsResponseType = ReturnType<typeof decodeUpdateMarketingQuestionsResponseModel>;