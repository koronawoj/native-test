import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeBoolean, decodeBooleanOrNull, decodeNumber, decodeString, decodeStringOrUndefined } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel, buildModelValidator } from 'src/api/utils/modelUtils';

const decodePropertiesModel= buildModelValidator('Casino category', {
    isForMobileFooter: buildApiItemDefault(decodeBooleanOrNull, false),
});

const decodeCasinoCategoryModel = buildModelValidator('Casino category', {
    id: buildApiItemDefault(decodeNumber, 0),
    displayOrder: buildApiItemDefault(decodeNumber, 0),
    active: buildApiItemDefault(decodeBoolean, false),
    name: buildApiItemDefault(decodeString, ''),
    providerCategory: buildApiItemDefault(decodeStringOrUndefined, ''),
    properties: buildApiItemSimple(decodePropertiesModel),
});

export type CasinoCategoryModelType = ReturnType<typeof decodeCasinoCategoryModel>;

const decodeList = buildArrayDecoderModel(decodeCasinoCategoryModel);



const decode = (status: number, data: ResponseType): Array<CasinoCategoryModelType> => {
    if (status === 200 && data.type === 'json') {
        return decodeList(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const casinoGetCategories = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/casino/get-categories',
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/casino/get-categories',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/casino-api/${params.API_UNIVERSE}/nyx/live-games/categories`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
