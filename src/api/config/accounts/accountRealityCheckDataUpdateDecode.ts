import {buildApiItemDefault, buildModelValidator} from 'src/api/utils/modelUtils';
import { decodeNumber } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    duration: buildApiItemDefault(decodeNumber, 0)
};

export const decodeUpdateRealityCheckModel = buildModelValidator('Update reality check data', modelConfig);

export type UpdateRealityCheckModelType = ReturnType<typeof decodeUpdateRealityCheckModel>;