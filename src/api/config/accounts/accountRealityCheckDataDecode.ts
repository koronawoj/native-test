import { buildModelValidator, buildApiItemDefault, buildApiItemSimple } from 'src/api/utils/modelUtils';
import {
    decodeNumberOrNull,
    decodeStringOrNull,
    decodeBooleanOrNull,
    buildOptionalDecoderModel
} from 'src/api/utils/commonModelValidators';

const decodeRealityCheckActiveStatus = buildModelValidator('', {
    duration: buildApiItemDefault(decodeNumberOrNull, null),
    setAt: buildApiItemDefault(decodeStringOrNull, null),
    url: buildApiItemDefault(decodeStringOrNull, null),
});

const decodeRealityCheckPendingStatus = buildModelValidator('', {
    activable: buildApiItemDefault(decodeBooleanOrNull, false),
    activableAt: buildApiItemDefault(decodeStringOrNull, null),
    duration: buildApiItemDefault(decodeNumberOrNull, null),
    setAt: buildApiItemDefault(decodeStringOrNull, null),
    url: buildApiItemDefault(decodeStringOrNull, null),
});

const modelConfig = {
    active: buildApiItemSimple(buildOptionalDecoderModel(decodeRealityCheckActiveStatus)),
    pending: buildApiItemSimple(buildOptionalDecoderModel(decodeRealityCheckPendingStatus)),
};

export const decodeAccountRealityCheckDataModel = buildModelValidator('Account reality check data', modelConfig);

export type AccountRealityCheckDataModelType = ReturnType<typeof decodeAccountRealityCheckDataModel>;