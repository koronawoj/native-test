import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import {
    buildModelValidator,
    buildApiItemDefault,
    buildArrayDecoderModel,
    buildApiItemSimple
} from 'src/api/utils/modelUtils';
import {
    decodeString,
    decodeNumber,
    decodeBoolean, decodeStringOrNull, decodeNumberOrNull, buildOptionalDecoderModel
} from 'src/api/utils/commonModelValidators';

const transactionType = buildValidator('transactionType', t.literal('withdrawal'));
const transactionStatus = buildValidator('transactionStatus', t.literal('cancelled'));

export const decodePaymentMethod = buildModelValidator('', {
    expires: buildApiItemDefault(decodeStringOrNull, null),
    id: buildApiItemDefault(decodeString, ''),
    lastUsedAt: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
    number: buildApiItemDefault(decodeString, ''),
    provider: buildApiItemDefault(decodeString, ''),
    providerReference: buildApiItemDefault(decodeString, ''),
    subtype: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
});

export const decodeCanceledWithdrawal = buildModelValidator('', {
    id: buildApiItemDefault(decodeNumber, 0),
    url: buildApiItemDefault(decodeString, ''),
    type: buildApiItemSimple(transactionType),
    status: buildApiItemSimple(transactionStatus),
    currency: buildApiItemDefault(decodeString, ''),
    accountId: buildApiItemDefault(decodeString, ''),
    tags: buildApiItemDefault(buildValidator('', t.unknown), {}),
    amount: buildApiItemDefault(decodeNumber, 0),
    paymentMethod: buildApiItemSimple(buildOptionalDecoderModel(decodePaymentMethod)),
    walletTransactionUrl: buildApiItemDefault(decodeString, '')
});

export type CanceledWithdrawalType = ReturnType<typeof decodeCanceledWithdrawal>;

export const decodeTransactionDetails = buildModelValidator('', {
    paymentMethod: buildApiItemSimple(buildOptionalDecoderModel(decodePaymentMethod)),
});

export const decodeTransactionItem = buildModelValidator('', {
    id: buildApiItemDefault(decodeNumber, 0),
    url: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
    status: buildApiItemDefault(decodeString, ''),
    details: buildApiItemSimple(buildOptionalDecoderModel(decodeTransactionDetails)),
    balanceDelta: buildApiItemDefault(decodeNumber, 0),
    fundsLocked: buildApiItemDefault(decodeNumber, 0),
    currency: buildApiItemDefault(decodeString, ''),
    tags: buildApiItemDefault(buildValidator('', t.unknown), {}),
    createdAt: buildApiItemDefault(decodeString, ''),
    updatedAt: buildApiItemDefault(decodeString, ''),
    finalizedAt: buildApiItemDefault(decodeStringOrNull, ''),
    finalized: buildApiItemDefault(decodeBoolean, false),
    amount: buildApiItemDefault(decodeNumber, 0),
    operatorAmount: buildApiItemDefault(decodeNumber, 0),
    totalAmount: buildApiItemDefault(decodeNumber, 0),
    operatorTotalAmount: buildApiItemDefault(decodeNumber, 0),
    operatorBalanceDelta: buildApiItemDefault(decodeNumber, 0),
    currencyRateAtCreation: buildApiItemDefault(decodeNumber, 0),
    currencyRateAtFinalization: buildApiItemDefault(decodeNumberOrNull, 0),
});

export type TransactionItemType = ReturnType<typeof decodeTransactionItem>;

const decodeResultsArray = buildArrayDecoderModel(decodeTransactionItem);

export const decodeWithdrawalsListModel = decodeResultsArray;

export type WithdrawalsListModelType = ReturnType<typeof decodeWithdrawalsListModel>;
