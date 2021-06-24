import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import {
    decodeString,
    decodeNumber,
    buildOptionalDecoderModel,
    decodeStringOrNull,
} from 'src/api/utils/commonModelValidators';

const decodePaymentFormRealex = buildModelValidator('paymentForm', {
    formActionUrl: buildApiItemDefault(decodeString, ''),
    formData: buildApiItemDefault(
        buildValidator('', t.record(t.string, t.string)),
        null
    ),
    type: buildApiItemDefault(decodeString, ''),
});

const decodePaymentFormSecureTrading = buildModelValidator('paymentForm', {
    formActionUrl: buildApiItemDefault(decodeString, ''),
    formData: buildApiItemDefault(
        buildValidator('', t.record(t.string, t.array(t.string))),
        null
    ),
    type: buildApiItemDefault(decodeString, ''),
});

const decodePaymentMethod = buildModelValidator('paymentMethod', {
    provider: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, '')
});

const modelConfig = {
    accountId: buildApiItemDefault(decodeString, ''),
    amount: buildApiItemDefault(decodeNumber, 0),
    currency: buildApiItemDefault(decodeString, ''),
    id: buildApiItemDefault(decodeNumber, 0),
    internalReason: buildApiItemDefault(decodeStringOrNull, null),
    paymentForm: buildApiItemSimple(buildOptionalDecoderModel(decodePaymentFormRealex)),
    secureTradingPaymentForm: buildApiItemSimple(buildOptionalDecoderModel(decodePaymentFormSecureTrading)),
    paymentMethod: buildApiItemSimple(buildOptionalDecoderModel(decodePaymentMethod)),
    reason: buildApiItemDefault(decodeStringOrNull, null),
    status: buildApiItemDefault(buildValidator('', t.union([t.literal('initiated'),t.literal('paid'),t.literal('failed')])), ''),
    tags: buildApiItemDefault(buildValidator('', t.unknown), {}),
    type: buildApiItemDefault(decodeString, '')
    // url: buildApiItemDefault(decodeString, ''), // if they are not used should be deleted from BE response
    // walletTransactionUrl: buildApiItemDefault(decodeString, '') // if they are not used should be deleted from BE response
};

export const decodeAccountTopUpDataModel = buildModelValidator('AccountTopUpData', modelConfig);
export type AccountTopUpDataModelType = ReturnType<typeof decodeAccountTopUpDataModel>;

const decodeErrorItem = buildModelValidator('', {
    resource: buildApiItemDefault(decodeString, ''),
    field: buildApiItemDefault(decodeString, ''),
    code: buildApiItemDefault(decodeString, ''),
    debugDetails: buildApiItemDefault(decodeString, '')
});
const decodeArrayErrorItem = buildArrayDecoderModel(decodeErrorItem);

const errorModel = {
    errors: buildApiItemDefault(decodeArrayErrorItem, [])
};
export const decodeTopUpErrorDataModel = buildModelValidator('TopUpErrorData', errorModel);
export type TopUpErrorDataModelType = ReturnType<typeof decodeErrorItem>;
