import { buildApiItemDefault, buildModelValidator, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    id: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
    url: buildApiItemDefault(decodeString, ''),
};

export const decodePopularSports = buildModelValidator('Get popular sports', modelConfig);
export const decodePopularSportsArray = buildArrayDecoderModel(decodePopularSports);

export type GetPopularSportsType = ReturnType<typeof decodePopularSportsArray>;
