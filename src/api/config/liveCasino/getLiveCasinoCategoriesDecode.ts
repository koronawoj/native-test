import { buildApiItemDefault, buildModelValidator, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeString, decodeNumberOrNull, decodeStringArr, decodeBoolean, decodeArrayStringOrNull } from 'src/api/utils/commonModelValidators';

const propertiesConfig = buildModelValidator('properties model', {
    order: buildApiItemDefault(decodeNumberOrNull, null),
    gamesOrdered: buildApiItemDefault(decodeArrayStringOrNull, [])
});

const modelConfig = {
    categoryId: buildApiItemDefault(decodeString, ''),
    providerCategories: buildApiItemDefault(decodeStringArr, []),
    gameIds: buildApiItemDefault(decodeStringArr, []),
    name: buildApiItemDefault(decodeString, ''),
    enabled: buildApiItemDefault(decodeBoolean, false),
    properties: buildApiItemSimple(propertiesConfig)
};

export const decode = buildModelValidator('Live Casino Categories Data', modelConfig);
export const decodeLiveCasinoGamesCategoriesModel = buildArrayDecoderModel(decode);
export type GetLiveCasinoGamesCategoriesResponseType = ReturnType<typeof decodeLiveCasinoGamesCategoriesModel>;