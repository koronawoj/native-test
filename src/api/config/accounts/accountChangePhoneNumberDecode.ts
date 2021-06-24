import {buildApiItemDefault, buildModelValidator} from 'src/api/utils/modelUtils';
import {decodeString} from 'src/api/utils/commonModelValidators';

const modelConfig = {
    email: buildApiItemDefault(decodeString, '')
};

export const decodeChangePhoneModel = buildModelValidator('Change phone data', modelConfig);

export type ChangePhoneModelType = ReturnType<typeof decodeChangePhoneModel>;