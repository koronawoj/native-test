import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple } from 'src/api/utils/modelUtils';
import {
    decodeNumber,
    decodeBoolean,
    decodeString
} from 'src/api/utils/commonModelValidators';

const decodeDeposits = buildModelValidator('', {
    minimalAmount: buildApiItemDefault(decodeNumber, 0),
    channels: buildApiItemDefault(buildValidator('', t.unknown), {})
});

const decodeWithdrawals = buildModelValidator('', {
    minimalAmount: buildApiItemDefault(decodeNumber, 0),
    channels: buildApiItemDefault(buildValidator('', t.unknown), {})
});

const decodeKyc = buildModelValidator('', {
    enabled: buildApiItemDefault(decodeBoolean, false),
    maxLimit: buildApiItemDefault(decodeNumber, 0),
});


export const bankingConfigs = {
    id: buildApiItemDefault(decodeString, ''),
    provider: buildApiItemDefault(decodeString, ''),
    deposits: buildApiItemSimple(decodeDeposits),
    withdrawals: buildApiItemSimple(decodeWithdrawals),
    kyc: buildApiItemSimple(decodeKyc)
};

export const decodeBankingConfigsDataModel = buildModelValidator('Accounts banking configs', bankingConfigs);

export type BankingConfigsModelType = ReturnType<typeof decodeBankingConfigsDataModel>;
