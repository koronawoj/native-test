import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeStringOrNull, decodeNumberOrNull, buildOptionalDecoderModel } from 'src/api/utils/commonModelValidators';

const decodeSilkModel = buildModelValidator('', {
    url: buildApiItemDefault(decodeStringOrNull, null),
});


const modelConfig = buildModelValidator('GetSilksFromCMSType - decode error', {
    race_id: buildApiItemDefault(decodeNumberOrNull, null),
    event_id: buildApiItemDefault(decodeNumberOrNull, null),
    participant_id: buildApiItemDefault(decodeNumberOrNull, null),
    runner_number: buildApiItemDefault(decodeNumberOrNull, null),
    horse: buildApiItemDefault(decodeStringOrNull, null),
    trainer: buildApiItemDefault(decodeStringOrNull, null),
    jockey: buildApiItemDefault(decodeStringOrNull, null),
    weight: buildApiItemDefault(decodeStringOrNull, null),
    age: buildApiItemDefault(decodeNumberOrNull, null),
    official_rating: buildApiItemDefault(decodeNumberOrNull, null),
    rating: buildApiItemDefault(decodeNumberOrNull, null),
    description: buildApiItemDefault(decodeStringOrNull, null),
    silk: buildApiItemSimple(
        buildOptionalDecoderModel(decodeSilkModel)
    ),
    race_overview_position: buildApiItemDefault(decodeNumberOrNull, null),
    participant_name: buildApiItemDefault(decodeStringOrNull, null),
});

export const decodeGetSilksFromCMS = buildArrayDecoderModel(modelConfig);
export type GetSilksFromCMSType = ReturnType<typeof decodeGetSilksFromCMS>;

export type HorseRacingParticipantItemType = ReturnType<typeof modelConfig>;