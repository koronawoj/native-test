import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeStringOrNull, decodeNumberOrNull, buildOptionalDecoderModel } from 'src/api/utils/commonModelValidators';

const decodeSilkModel = buildModelValidator('Decode silk model', {
    url: buildApiItemDefault(decodeStringOrNull, null),
});

const modelConfig = buildModelValidator('GetHeroParticipantType - decode error', {
    event_id: buildApiItemDefault(decodeNumberOrNull, null),
    selection_id: buildApiItemDefault(decodeNumberOrNull, null),
    participant_id: buildApiItemDefault(decodeNumberOrNull, null),
    participant_color: buildApiItemDefault(decodeStringOrNull, null),
    participant_name: buildApiItemDefault(decodeStringOrNull, null),
    points: buildApiItemDefault(decodeNumberOrNull, null),
    wins: buildApiItemDefault(decodeNumberOrNull, null),
    race_form: buildApiItemDefault(decodeStringOrNull, null),
    race_starts: buildApiItemDefault(decodeNumberOrNull, null),
    trainer: buildApiItemDefault(decodeStringOrNull, null),
    form: buildApiItemDefault(decodeStringOrNull, null),
    top_speed: buildApiItemDefault(decodeNumberOrNull, null),
    runner_number: buildApiItemDefault(decodeNumberOrNull, null),
    horse: buildApiItemDefault(decodeStringOrNull, null),
    jockey: buildApiItemDefault(decodeStringOrNull, null),
    age: buildApiItemDefault(decodeNumberOrNull, null),
    weight: buildApiItemDefault(decodeStringOrNull, null),
    official_rating: buildApiItemDefault(decodeNumberOrNull, null),
    rating: buildApiItemDefault(decodeNumberOrNull, null),
    race_overview_position: buildApiItemDefault(decodeNumberOrNull, null),
    description: buildApiItemDefault(decodeStringOrNull, null),
    participant_img: buildApiItemSimple(buildOptionalDecoderModel(decodeSilkModel)),
});

export const decodeGetHeroParticipant = buildArrayDecoderModel(modelConfig);

export type GetHeroParticipantType = ReturnType<typeof decodeGetHeroParticipant>;

export type HeroParticipantItemType = ReturnType<typeof modelConfig>;
