import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import * as t from 'io-ts';
import { GenerateUrlApiParamsType, GenerateUrlApiParamsWithSessionIdType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { AccountTopUpDataModelType, decodeAccountTopUpDataModel, TopUpErrorDataModelType, decodeTopUpErrorDataModel } from './accountTopUpProcedureDecode';
import { SavedPaymentMethodCardType } from 'src/api/config/accounts/accountSavedPaymentMethodsDecode';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { fetchGet } from '@twoupdigital/realtime-server/libjs/fetch';
import { BillingInfoData } from 'src/ui/account/TopUpProcedure/MutualTopUpProcedure.state';

export interface ValidationFiledType {
    value: string | null | undefined,
    name: string
}

//Banking request
const ResponseBankingItemIO = t.interface({
    provider: t.string,
});

const ResponseBankingBodyIO = t.interface({
    status: t.literal(200),
    bodyJson: ResponseBankingItemIO
});

export type BankingConfigsResponseType = t.TypeOf<typeof ResponseBankingItemIO>;

const decodeAdditionalResponseForBanking = buildValidator('BankingConfigs-> ResponseIO', ResponseBankingBodyIO, true);

const additionalRequestForBanking = async (params: GenerateUrlApiParamsType<TopUpParamsType>): Promise<BankingConfigsResponseType> => {

    const response = await fetchGet({
        url: `${params.API_URL}/banking-configs/${params.API_UNIVERSE}`,
        backendToken: params.jwtToken,
        decode: decodeAdditionalResponseForBanking
    });

    return response.bodyJson;
};

//Wallet request
const ResponseWalletItemIO = t.interface({
    currency: t.string,

});

const ResponseWalletBodyIO = t.interface({
    status: t.literal(200),
    bodyJson: ResponseWalletItemIO
});

export type WalletConfigsResponseType = t.TypeOf<typeof ResponseWalletItemIO>;

const decodeAdditionalResponseForWallet = buildValidator('Wallet-> ResponseIO', ResponseWalletBodyIO, true);

const additionalRequestForWallet = async (params: GenerateUrlApiParamsWithSessionIdType): Promise<WalletConfigsResponseType> => {

    const response = await fetchGet({
        url: `${params.API_URL}/wallets/${params.API_UNIVERSE}/${params.userSessionId}`,
        backendToken: params.jwtToken,
        decode: decodeAdditionalResponseForWallet,
    });

    return response.bodyJson;
};

export type TopUpSuccessResponseType = {
    status: 'success',
    bodyJson: AccountTopUpDataModelType
}

export type TopUpErrorResponseType = {
    status: 'error',
    bodyJson: TopUpErrorDataModelType | undefined
}

//TopUp request
const decode = (status: number, data: ResponseType): TopUpSuccessResponseType | TopUpErrorResponseType => {
    if (status === 201 && data.type === 'json') {
        return {
            status: 'success',
            bodyJson: decodeAccountTopUpDataModel(data.json)
        };
    }

    if (status === 422 && data.type === 'json') {
        const decoded = decodeTopUpErrorDataModel(data.json);
        return {
            status: 'error',
            bodyJson: decoded.errors[0]
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface TopUpParamsType {
    amount: number,
    paymentMethod?: SavedPaymentMethodCardType,
    cacheToken?: string,
    securityCode?: string,
    billingInfo: BillingInfoData
};

type InnerBodyType = TopUpParamsType;

export const accountTopUpData = {
    browser: {
        params: (params: TopUpParamsType): ParamsFetchType<InnerBodyType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/deposit',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/deposit',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<TopUpParamsType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const walletParams = {
            API_URL: params.API_URL,
            API_UNIVERSE: params.API_UNIVERSE,
            userSessionId: params.userSessionId,
            jwtToken: params.jwtToken
        };

        const additionalResponseForWallet = await additionalRequestForWallet(walletParams);
        const additionalResponseForBanking = await additionalRequestForBanking(params);

        const { amount, paymentMethod, cacheToken, securityCode, billingInfo } = params.req.body;

        return {
            url: `${params.API_URL}/deposits/${params.API_UNIVERSE}/${params.userSessionId}`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                amount: amount,
                currency: additionalResponseForWallet.currency,
                status: 'initiated',
                channel: 'default',
                /* eslint-disable-next-line */
                paymentMethod: paymentMethod || {
                    provider: additionalResponseForBanking.provider,
                    type: 'credit-card'
                },
                cacheToken: cacheToken,
                securityCode: securityCode,
                // themeId
                billingInfo: {
                    email: billingInfo.email,
                    mobile: {
                        prefix: billingInfo.prefix,
                        number: billingInfo.number
                    },
                    billing: {
                        addressLine1: billingInfo.addressLine1,
                        addressLine2: billingInfo.addressLine2,
                        addressLine3: '',
                        city: billingInfo.city,
                        postalCode: billingInfo.postCode,
                        country: billingInfo.country
                    }
                }
            }
        };
    }
};
