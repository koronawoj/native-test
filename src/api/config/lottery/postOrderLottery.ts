import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { MethodType, GenerateUrlApiType, ParamsFetchType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { openapi_lottery_postOrderLottery, decodeResponse200, Response200Type  } from 'src/api_openapi/generated/openapi_lottery_postOrderLottery';

export type OrderLotteryResponseType = {
    status: 'success',
    bodyJson: Response200Type
}

const OrderLotteryErrorResponseIO = t.interface ({
    code: t.string,
    message: t.string,
});

const decodeOrderLotteryError = buildValidator('POST buy ticket/s - errors', OrderLotteryErrorResponseIO);
type PostOrderLotteryErrorType = ReturnType<typeof decodeOrderLotteryError>;

export type OrderLotteryErrorResponseType = {
    status: 'error',
    bodyJson: PostOrderLotteryErrorType
} | {
    status: 'error',
    bodyJson: {
        internalError:PostOrderLotteryErrorType,
        message:string
    }
}

const decode = (status: number, data: ResponseType): OrderLotteryResponseType | OrderLotteryErrorResponseType => {
    if (status === 200 && data.type === 'json') {
        const dataSuccess = decodeResponse200(data.json);

        if (dataSuccess instanceof Error) {
            throw dataSuccess;
        }

        return {
            status: 'success',
            bodyJson: dataSuccess
        };
    }

    if ((status === 400 || status === 404 || status === 500) && data.type === 'json') {
        const dataError = decodeOrderLotteryError(data.json);

        if (dataError instanceof Error) {
            throw dataError;
        }

        if (status === 500) {
            return {
                status: 'error',
                bodyJson: {
                    internalError: dataError,
                    message: 'We have some server issue, please try again later'
                }
            };
        }

        return {
            status: 'error',
            bodyJson: dataError
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface OrderLotteryParamsType {
    qty: number
};

export const postOrderLottery = {
    browser: {
        params: (params: OrderLotteryParamsType):  ParamsFetchType<OrderLotteryParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/lottery/buy-ticket',
                body: params
            };
        },
        decode: decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/lottery/buy-ticket',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<OrderLotteryParamsType>): Promise<GenerateUrlApiType> => {

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const resp = await openapi_lottery_postOrderLottery(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString(),
            requestBody: {
                qty: params.req.body.qty
            }
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    },
};
