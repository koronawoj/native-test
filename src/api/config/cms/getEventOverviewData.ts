import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { EventOverviewDataType, decodeEventOverviewData } from 'src/api/config/cms/getEventOverviewDataDecode';

const decode = (status: number, data: ResponseType): EventOverviewDataType  => {

    if (status === 200 && data.type === 'json') {
        return decodeEventOverviewData(data.json);
    } else if (status === 400 || status === 404){
        return [];
    }


    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getEventOverviewData = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/event-overview'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/event-overview',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {

        return {
            url: `${params.API_URL}/cms/eventoverviewdetail/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
