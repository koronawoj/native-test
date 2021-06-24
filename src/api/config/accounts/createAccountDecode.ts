import { decodeString, decodeStringOrNull } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator, buildArrayDecoderModel } from 'src/api/utils/modelUtils';

const decodeErrorItem = buildModelValidator('', {
    code: buildApiItemDefault(decodeStringOrNull, null),
    debugDetails: buildApiItemDefault(decodeStringOrNull, null),
    field: buildApiItemDefault(decodeStringOrNull, null),
    pointer: buildApiItemDefault(decodeStringOrNull, null),
    resource: buildApiItemDefault(decodeStringOrNull, null)
});

const decodeArrayErrorItem = buildArrayDecoderModel(decodeErrorItem);

const errorModel = {
    code: buildApiItemDefault(decodeString, ''),
    debugDetails: buildApiItemDefault(decodeStringOrNull, null),
    details: buildApiItemDefault(decodeStringOrNull, null),
    errors: buildApiItemDefault(decodeArrayErrorItem, []),
    message: buildApiItemDefault(decodeString, ''),
};

const createAccountModel = {
    token: buildApiItemDefault(decodeString, '')
};

export const decodeCreateAccountErrorModel = buildModelValidator('Create account error', errorModel);
export type CreateAccountErrorModel = ReturnType<typeof decodeCreateAccountErrorModel>;

export const decodeCreateAccountSuccessModel = buildModelValidator('Create account success', createAccountModel);
export type CreateAccountModel = ReturnType<typeof decodeCreateAccountSuccessModel>;
