import qs from 'query-string';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { decodeNetDepositDataModel, NetDepositDataModelType } from './accountNetDepositsDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): NetDepositDataModelType   => {
    if (status === 200 && data.type === 'json') {
        return decodeNetDepositDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface NetDepositParamsType {
    perPage: number,
    startDate?: string | undefined,
    endDate?: string | undefined,
};

type InnerBodyType = NetDepositParamsType;

export const accountNetDepositsData = {
    browser: {
        params: (params: NetDepositParamsType): ParamsFetchType<InnerBodyType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/net-deposits',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/net-deposits',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<InnerBodyType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const startDate = params.req.body.startDate !== undefined
            ? `${params.req.body.startDate}T00:00:00Z`
            : undefined;

        const endDate = params.req.body.endDate !== undefined
            ? `${params.req.body.endDate}T23:59:59Z`
            : undefined;

        const query = {
            sort: '-date',
            page: 1,
            perPage: params.req.body.perPage,
            startDate: startDate,
            endDate: endDate
        };

        const queryParams = qs.stringify(query);

        return {
            url: `${params.API_URL}/net-deposits/${params.API_UNIVERSE}/${params.userSessionId}?${queryParams}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
