import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';

import { decodeAccountAllBetsDataModel, AccountAllBetsDataModelType } from './accountAllBetsDataDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const decode = (status: number, data: ResponseType): AccountAllBetsDataModelType => {
    if (status === 200 && data.type === 'json') {
        return decodeAccountAllBetsDataModel(data.json);
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface CreateAccountFreeBetsParamsType {
    id: number,
};
export interface User {
    name: string,
    id: number,
}

export interface ParamsType {
    perPage: number,
    from?: string,
    to?: string,
    statusOpen?: boolean,
}

interface BodyType {
    perPage: number,
    from?: string,
    to?: string,
    statusOpen?: boolean,
}

export const accountAllBetsData = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<BodyType> => {

            return {
                type: MethodType.POST,
                url: '/api-web/account/all-bets',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/all-bets'
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<BodyType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const from = params.req.body.from;
        const to = params.req.body.to;
        const statusOpen = params.req.body.statusOpen;

        const criteria: Array<{
            field: string,
            type: string,
            value?: string | number,
            values?: Array<string>,
        }> = [{
            field: 'account.id',
            type: 'eq',
            value: params.userSessionId
        }];

        if (statusOpen === true) {
            criteria.push({
                field: 'status',
                type: 'in',
                values: ['open', 'parked']
            });
        }

        if (from !== undefined) {
            criteria.push({
                field: 'placedAt',
                type: 'gte',
                value: `${from}T00:00:00`
            });
        }

        if (to !== undefined) {
            criteria.push({
                field: 'placedAt',
                type: 'lte',
                value: `${to}T23:59:59`
            });
        }

        return {
            url: `${params.API_URL}/all-bets/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                criteria: criteria,
                page: 1,
                sort: ['-placedAt'],
                perPage: params.req.body.perPage,
                'aggregations': {
                    'noOfBets': {
                        'type': 'count'
                    }
                }
            }
        };
    }
};
