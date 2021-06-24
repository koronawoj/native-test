import * as t from 'io-ts';
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeString, decodeStringOrNull, decodeErrorResponse, decodeBoolean, decodeNumber } from 'src/api/utils/commonModelValidators';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

const decodeAccount = buildModelValidator('account', {
    id: buildApiItemDefault(decodeNumber, 0),
    name: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
});

const modelConfig = {
    account: buildApiItemSimple(decodeAccount),
    cashOut: buildApiItemSimple(decodeBoolean),
    channel: buildApiItemDefault(decodeString, ''),
    country: buildApiItemDefault(decodeString, ''),
    currency: buildApiItemDefault(decodeString, ''),
    eachWay: buildApiItemSimple(decodeBoolean),
    id: buildApiItemSimple(decodeNumber),
    ip: buildApiItemDefault(decodeString, ''),
    legs: buildApiItemDefault(buildValidator('', t.unknown), {}),
    maxBet: buildApiItemSimple(decodeNumber),
    numLines: buildApiItemSimple(decodeNumber),
    operatorPayout: buildApiItemSimple(decodeNumber),
    operatorProfit: buildApiItemSimple(decodeNumber),
    operatorStakePerLine: buildApiItemSimple(decodeNumber),
    operatorTotalStake: buildApiItemSimple(decodeNumber),
    payout: buildApiItemSimple(decodeNumber),
    placedAt: buildApiItemDefault(decodeString, ''),
    potentialReturns: buildApiItemSimple(decodeNumber),
    profit: buildApiItemSimple(decodeNumber),
    remarks: buildApiItemDefault(buildValidator('', t.unknown), {}),
    settledAt: buildApiItemDefault(decodeString, ''),
    settledBy: buildApiItemSimple(decodeAccount),
    stakeFactor: buildApiItemSimple(decodeNumber),
    stakePerLine: buildApiItemSimple(decodeNumber),
    status: buildApiItemDefault(decodeString, ''),
    totalStake: buildApiItemSimple(decodeNumber),
    transaction: buildApiItemDefault(buildValidator('', t.unknown), {}),
    type: buildApiItemDefault(decodeString, ''),
};

export const decodeRetrieveCashOutDataModel = buildModelValidator('RetrieveCashOut', modelConfig);
export type RetrieveCashOutModelType = ReturnType<typeof decodeRetrieveCashOutDataModel>;

const decodeError = buildModelValidator('decodeError', {
    resource: buildApiItemDefault(decodeString, ''),
    code: buildApiItemDefault(decodeString, ''),
});

const errorModelConfig = {
    responseType: buildApiItemDefault(decodeErrorResponse, 'error'),
    code: buildApiItemDefault(decodeString, ''),
    debugDetails: buildApiItemDefault(decodeStringOrNull, ''),
    details: buildApiItemDefault(decodeStringOrNull, ''),
    errors: buildApiItemSimple(buildArrayDecoderModel(decodeError)),
    message: buildApiItemDefault(decodeStringOrNull, '')
};

export const decodeRetrieveCashOutDataErrorModel = buildModelValidator('RetrieveCashOutError', errorModelConfig);
export type RetrieveCashOutErrorModelType = ReturnType<typeof decodeRetrieveCashOutDataErrorModel>;
