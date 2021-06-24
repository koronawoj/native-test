import { buildApiItemDefault, buildModelValidator, buildArrayDecoderModel, buildApiItemSimple } from 'src/api/utils/modelUtils';
import { decodeString, decodeBoolean, decodeNumber, buildOptionalDecoderModel, decodeNumberOrNull } from 'src/api/utils/commonModelValidators';

const decodeProperties = buildModelValidator('Properties', {});

const decodeGameList = buildModelValidator('', {
    gameID: buildApiItemDefault(decodeString, ''),
    gameName: buildApiItemDefault(decodeString, ''),
    properties: buildApiItemDefault(buildOptionalDecoderModel(decodeProperties), null),
    enabled: buildApiItemDefault(decodeBoolean, true),
    rating: buildApiItemDefault(decodeNumberOrNull, null),
    playerRating: buildApiItemDefault(decodeNumberOrNull, null),
    favourite: buildApiItemDefault(decodeBoolean, true),
    gameTypeID: buildApiItemDefault(decodeString, ''),
    typeDescription: buildApiItemDefault(decodeString, ''),
    technologyID: buildApiItemDefault(decodeString, ''),
    technology: buildApiItemDefault(decodeString, ''),
    platform: buildApiItemDefault(decodeString, ''),
    demoGameAvailable: buildApiItemDefault(decodeBoolean, true),
    aspectRatio: buildApiItemDefault(decodeString, ''),
    gameIdNumeric: buildApiItemDefault(decodeNumber, 0),
});

const modelConfig = {
    description: buildApiItemDefault(decodeString, ''),
    gameList: buildApiItemSimple(buildArrayDecoderModel(decodeGameList))
};

export const decodeLiveCasinoGamesModel = buildModelValidator('Get Live casino games', modelConfig);
export type GetLiveCasinoGamesResponseType = ReturnType<typeof decodeLiveCasinoGamesModel>;
