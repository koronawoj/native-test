import { buildModelValidator, buildApiItemDefault, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeStringOrNull, decodeNumberOrNull } from 'src/api/utils/commonModelValidators';

const modelConfig = buildModelValidator('GetF1OverviewFromCMSType - decode error', {
    event_id: buildApiItemDefault(decodeNumberOrNull, null),
    name: buildApiItemDefault(decodeStringOrNull, null),
    description: buildApiItemDefault(decodeStringOrNull, null),

});

export const decodeGetF1OverviewFromCMS = buildArrayDecoderModel(modelConfig);

export type GetF1OverviewFromCMSType = ReturnType<typeof decodeGetF1OverviewFromCMS>;