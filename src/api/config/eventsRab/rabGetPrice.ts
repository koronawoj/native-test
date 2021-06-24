import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { RabPostBodyItemType } from 'src/appState/modules/RabState/Types';
import { decodeNumber, decodeString } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import translateGlobally from 'src/utils/translateGlobally';
import { arrayGet, recordGet } from 'src/utils/safeGetters';

const decodeRabPriceModel = buildModelValidator('Rab PriceModel', {
    payout: buildApiItemDefault(decodeNumber, 0),
    price: buildApiItemDefault(decodeNumber, 0),
    stake: buildApiItemDefault(decodeNumber, 0),
    priceFractional: buildApiItemDefault(decodeString, ''),
});

const decodeRabPriceErrorModel = buildModelValidator('Rab PriceModel Error', {
    code: buildApiItemDefault(decodeString, ''),
    errors: buildApiItemDefault(buildValidator('errors', t.array(
        t.partial({
            arguments: t.record(t.string, t.unknown),
            code: t.string,
            message: t.string
        })
    )), []),
    message: buildApiItemDefault(decodeString, ''),
});

export type RabPriceModelType = ReturnType<typeof decodeRabPriceModel>;
export type RabPriceModelErrorType = ReturnType<typeof decodeRabPriceErrorModel>;

export type RabPriceSuccess = {
    type: 'ok',
    data: RabPriceModelType
}

export type RabPriceError = {
    type: 'error',
    data: RabPriceModelErrorType
}

export type RabPriceSuspended = {
    type: 'suspended',
    data: RabPriceModelErrorType
}

const errorMessages:Record<string, () => string> = {
    ['rab-service.BETTING_TOO_MANY_ANYTIME_SCORERS']: () => translateGlobally(t => t('rab-service.BETTING_TOO_MANY_ANYTIME_SCORERS', 'A bet can have at most three anytime scorer and anytime carded player selections.')),
    ['rab-service.BETTING_TOO_MANY_NEXT_SCORERS']: () => translateGlobally(t => t('rab-service.BETTING_TOO_MANY_NEXT_SCORERS', 'A bet can have only one first scorer and first carded player selection.')),
};

export const getRABErrorMessage = (data: RabPriceModelErrorType): string | undefined => {
    const error = arrayGet(data.errors, 0);
    if (error !== undefined && error.code !== undefined) {
        const getMessage = recordGet(errorMessages, error.code);
        if (getMessage !== undefined) {
            return getMessage();
        }
    }
    return undefined;
};

const decode = (status: number, data: ResponseType): RabPriceSuccess | RabPriceError | RabPriceSuspended => {
    if (status === 200 && data.type === 'json') {
        const result = decodeRabPriceModel(data.json);
        return {
            type: 'ok',
            data: result
        };
    }

    if (status === 400 && data.type === 'json') {
        const result = decodeRabPriceErrorModel(data.json);

        if (getRABErrorMessage(result) !== undefined) {
            return {
                type: 'error',
                data: result
            };
        }

        if (arrayGet(result.errors, 0)?.message !== 'Bet not possible') {
            return {
                type: 'suspended',
                data: result
            };
        }

        return {
            type: 'error',
            data: result
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface ParamsType {
    platformId: string,
    stake: number,
    selectionLegs: Array<RabPostBodyItemType>,
};

interface ExpressParamsType {
    platformId: string,
    stake: number,
    selectionLegs: Array<RabPostBodyItemType>,
}

export const rabGetPrice = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ExpressParamsType> => {
            const { platformId, stake, selectionLegs } = params;

            return {
                type: MethodType.POST,
                url: '/api-web/get-rab-price',
                body: {
                    platformId,
                    stake,
                    selectionLegs,
                }
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/get-rab-price',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ExpressParamsType>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/rab-api/${params.API_UNIVERSE}/events/${params.req.body.platformId}/bets/price`,
            passToBackend: true,
            method: MethodType.POST
        };
    }
};
