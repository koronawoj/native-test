import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeStringOrUndefined } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildApiItemSimple, buildModelValidator } from 'src/api/utils/modelUtils';

const decodeConfigs = buildModelValidator('Casino banner model', {
    'banner-slide-time': buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeCasinoBannersConfig = buildModelValidator('Casino banner model', {
    configs: buildApiItemSimple(decodeConfigs),
});

/*
configs: {
    banner-slide-time: {
        id: "banner-config",
        universe: "star",
    }
}
*/

export type CasinoBannersConfigType = ReturnType<typeof decodeCasinoBannersConfig>;

const decode = (status: number, data: ResponseType): CasinoBannersConfigType => {
    if (status === 200 && data.type === 'json') {
        if (data.json === null) {
            return {
                configs: {
                    ['banner-slide-time']: '60'
                }
            };
        }

        return decodeCasinoBannersConfig(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const casinoGetBannersConfig = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api/banners/configures/banner-config',                            //TODO
            };
        },
        decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/casino/get-banners-config',
    },
    generateUrlApi: async (_params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: 'TODO',
            passToBackend: true,
            method: MethodType.GET
        };
    }
};


