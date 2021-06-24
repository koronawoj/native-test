import {buildApiItemDefault, buildModelValidator} from 'src/api/utils/modelUtils';
import {decodeNumber, decodeStringOrNull} from 'src/api/utils/commonModelValidators';

const modelConfig = {
    id: buildApiItemDefault(decodeNumber, 0),
    slug: buildApiItemDefault(decodeStringOrNull, null),
    title: buildApiItemDefault(decodeStringOrNull, null),
    content: buildApiItemDefault(decodeStringOrNull, null),
    description: buildApiItemDefault(decodeStringOrNull, null),
    keywords: buildApiItemDefault(decodeStringOrNull, null),
    seoTitle: buildApiItemDefault(decodeStringOrNull, null),
};

export const decodeStaticPagesDataModel = buildModelValidator('Static page data', modelConfig);

export type StaticPageDataModelType = ReturnType<typeof decodeStaticPagesDataModel>;
