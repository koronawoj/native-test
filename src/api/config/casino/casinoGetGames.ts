import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeBoolean, decodeNumber, decodeString, decodeStringOrNumber, decodeStringOrUndefined } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel, buildDecodeWithDefault, buildModelValidator, buildRecordDecoderModel } from 'src/api/utils/modelUtils';

const decodeCasinoGameModelProperties = buildModelValidator('GameModelProperties', {
    howToPlay: buildApiItemDefault(decodeStringOrUndefined, ''),
    released: buildApiItemDefault(decodeStringOrNumber, 0),
    channels: buildApiItemDefault(decodeString, ''),
    imageUrl: buildApiItemDefault(decodeString, ''),
    shortDescription: buildApiItemDefault(decodeString, ''),
    supplier: buildApiItemDefault(decodeString, ''),                                //game operator
    lunchGameId: buildApiItemDefault(decodeStringOrUndefined, ''),                  //id game in pragmatic
    recommendation: buildApiItemDefault(decodeNumber, 0),
});

const decodeCategoryAndOrder = buildModelValidator('CategoryAndOrder', {
    categoryId: buildApiItemDefault(decodeNumber, 0),
    displayOrder: buildApiItemDefault(decodeNumber, 0),
});

const decodeCasinoGameModel = buildModelValidator('GameModel', {
    id: buildApiItemDefault(decodeNumber, 0),                        //is used
    nyxGameId: buildApiItemDefault(decodeNumber, 0),                        //is used
    properties: buildApiItemSimple(decodeCasinoGameModelProperties),
    isDemo: buildApiItemDefault(decodeBoolean, false),
    isFavourite: buildApiItemDefault(decodeBoolean, false),
    myRating: buildApiItemDefault(decodeNumber, 0),
    rating: buildApiItemDefault(decodeNumber, 0),
    name: buildApiItemDefault(decodeString, ''),
    categoryAndOrder: buildApiItemSimple(buildArrayDecoderModel(decodeCategoryAndOrder)),
});

export type CasinoGameModelType = ReturnType<typeof decodeCasinoGameModel>;

const decodeGamesCounter: ((data: unknown) => number) = buildDecodeWithDefault('Games counter', decodeNumber, 0);

const decodeMetadata = buildModelValidator('Metadata', {
    totalGames: buildApiItemDefault(decodeNumber, 0),
    totalGamesPerCategory: buildApiItemSimple(buildRecordDecoderModel(decodeGamesCounter))
});

const decodeContent = buildModelValidator('Content', {
    all: buildApiItemSimple(buildArrayDecoderModel(decodeCasinoGameModel)),
});

const decodeCasinoGames = buildModelValidator('CasinoGames', {
    content: buildApiItemSimple(decodeContent),
    metadata: buildApiItemSimple(decodeMetadata),
});

export type CasinoGamesType = ReturnType<typeof decodeCasinoGames>;

const decode = (status: number, data: ResponseType): CasinoGamesType | null => {
    if (status === 404) {
        return null;
    }

    if (status === 200 && data.type === 'json') {
        return decodeCasinoGames(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface CasinoGetGamesParamsType {
    mobile: boolean,
    query?: string,
}

interface QryType {
    field: string,
    op: string,
    value: string,
};

const createQry = (field: string, op: string, value: string): QryType => ({
    field,
    op,
    value,
});

interface SrtType {
    field: string,
    order: string,
}

const createSrt = (field: string, order: string): SrtType => ({
    field,
    order,
});

interface QueryType {
    qry: Array<QryType>,
    srt: Array<SrtType>,
}

const mainQuery = (params: CasinoGetGamesParamsType): QueryType => {
    const qry: Array<QryType> = [];
    const srt: Array<SrtType> = [];

    qry.push(createQry('active', 'EQ', 'true'));
    qry.push(createQry('display', 'EQ', 'true'));

    if (params.query !== undefined && params.query !== '') {
        qry.push(createQry('name', 'LK', params.query));
    }

    qry.push(createQry('properties.channels', 'LK', params.mobile ? 'mobile' : 'desktop'));

    srt.push(createSrt('displayOrder', 'DESC'));

    return {
        qry,
        srt,
    };
};

interface ParamsExpressType {
    mobile: boolean,
    query?: string,
}

export const casinoGetGames = {
    browser: {
        params: (params: CasinoGetGamesParamsType): ParamsFetchType<ParamsExpressType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/casino/get-games',
                body: params,
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/casino/get-games',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsExpressType>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/casino-api/${params.API_UNIVERSE}/nyx/live-games/search`,
            passToBackend: true,
            method: MethodType.POST,
            body: mainQuery(params.req.body)
        };
    }
};
