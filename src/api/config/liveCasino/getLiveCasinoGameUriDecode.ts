import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';

export const decodeGameUriDataModel = buildModelValidator('Game URI Data', {
    uri: buildApiItemDefault(decodeString, '')
});

export type GetGameUriDataResponseType = ReturnType<typeof decodeGameUriDataModel>;

export const decodeGameUriErrorModel = buildModelValidator('Game URI Error', {
    message: buildApiItemDefault(decodeString, '')
});
