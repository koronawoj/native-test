import { buildModelValidator, buildApiItemDefault, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeStringOrNull, decodeNumberOrNull } from 'src/api/utils/commonModelValidators';

const modelConfig = buildModelValidator('GetF1ParticipantsFromCMSType - decode error', {
    event_id: buildApiItemDefault(decodeNumberOrNull, null),
    participant_id: buildApiItemDefault(decodeNumberOrNull, null),
    selection_id: buildApiItemDefault(decodeNumberOrNull, null),
    team_color: buildApiItemDefault(decodeStringOrNull, null),
    driver: buildApiItemDefault(decodeStringOrNull, null),
    points: buildApiItemDefault(decodeNumberOrNull, null),
    wins: buildApiItemDefault(decodeNumberOrNull, null),
    race_form: buildApiItemDefault(decodeStringOrNull, null),
    description: buildApiItemDefault(decodeStringOrNull, null),
    rating: buildApiItemDefault(decodeNumberOrNull, null),
    race_starts: buildApiItemDefault(decodeNumberOrNull, null),
    race_overview_position: buildApiItemDefault(decodeNumberOrNull, null),
    participant_name: buildApiItemDefault(decodeStringOrNull, null),
});

export const decodeGetF1ParticipantsFromCMS = buildArrayDecoderModel(modelConfig);

export type GetF1ParticipantsFromCMSType = ReturnType<typeof decodeGetF1ParticipantsFromCMS>;

export type F1ParticipantItemType = ReturnType<typeof modelConfig>;