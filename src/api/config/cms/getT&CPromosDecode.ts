import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeStringOrNull } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    slug: buildApiItemDefault(decodeStringOrNull, null),
    title:  buildApiItemDefault(decodeStringOrNull, null),
    content: buildApiItemDefault(decodeStringOrNull, null),
    description:  buildApiItemDefault(decodeStringOrNull, null),
};

export const decodeGetTermsConditionCMS = buildModelValidator('Get promo terms and conditions', modelConfig);

export type GetPromoTermsConditionsCMSType = ReturnType<typeof decodeGetTermsConditionCMS>;