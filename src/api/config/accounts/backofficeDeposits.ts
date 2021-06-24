import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { decodeBackofficeDepositsDataModel, BackofficeDepositsModelType } from './backofficeDepositsDecode';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.interface({})
});

const decodeSuccessResponse = buildValidator('SuccessResponse', SuccessResponseIO);

const ErrorResponseIO = t.union([
    t.interface({
        status: t.literal(400),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown,
    })
]);

type ErrorResponseType = t.TypeOf<typeof ErrorResponseIO>;

export type BackofficeDepositsSuccessResponseType = {
    status: 200,
    bodyJson: BackofficeDepositsModelType;
};

const decodeResponseError = buildValidator('getBackofficeDeposits -> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): BackofficeDepositsSuccessResponseType | ErrorResponseType | Error => {
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeBackofficeDepositsDataModel(dataSuccess.bodyJson)
        };
    }
};

export const backofficeDeposits = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/secureTrading-configs/backoffice-deposits'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/secureTrading-configs/backoffice-deposits',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/secureTrading-configs/${params.API_UNIVERSE}/backoffice-deposits`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
