import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    url: buildApiItemDefault(decodeString, ''),
};


export const decodeVirtualGame = buildModelValidator('Get popular sports', modelConfig);

export type GetVirtualGameType = ReturnType<typeof decodeVirtualGame>;
