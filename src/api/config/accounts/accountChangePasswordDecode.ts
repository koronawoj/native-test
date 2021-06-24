import {buildApiItemDefault, buildModelValidator} from 'src/api/utils/modelUtils';
import {decodeString} from 'src/api/utils/commonModelValidators';

const modelConfig = {
    email: buildApiItemDefault(decodeString, '')
};

export const decodeChangePasswordModel = buildModelValidator('Change password data', modelConfig);

export type ChangePasswordModelType = ReturnType<typeof decodeChangePasswordModel>;