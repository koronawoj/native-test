import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeBoolean, decodeNumber, decodeString } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildArrayDecoderModel, buildModelValidator } from 'src/api/utils/modelUtils';

//$appState.apiCommon.casinoGetBanners.run({}).then((resp) => console.info('resp', resp));

const decodeCasinoBannerModel = buildModelValidator('Casino banner model', {
    id: buildApiItemDefault(decodeNumber, 0),
    active: buildApiItemDefault(decodeBoolean, false),
    btnAction: buildApiItemDefault(decodeString, ''),
    btnText: buildApiItemDefault(decodeString, ''),
    // createdDate: 1598538186937
    description: buildApiItemDefault(decodeString, ''),
    headline: buildApiItemDefault(decodeString, ''),
    imageUrl: buildApiItemDefault(decodeString, ''),
    // scheduleEnd: 1607786488000
    // scheduleStart: 1598538088675
    // updatedDate: 1598538188679
});

export type CasinoBannerModelType = ReturnType<typeof decodeCasinoBannerModel>;

const decodeList = buildArrayDecoderModel(decodeCasinoBannerModel);



const decode = (status: number, data: ResponseType): Array<CasinoBannerModelType> => {
    if (status === 200 && data.type === 'json') {
        return decodeList(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const casinoGetBanners = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api/banners',                            //TODO
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/casino/get-banners',
    },
    generateUrlApi: async (_params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: 'TODO',
            passToBackend: true,
            method: MethodType.GET
        };
    }
};


