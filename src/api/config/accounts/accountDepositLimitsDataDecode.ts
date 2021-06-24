import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { buildApiItemDefault, buildApiItemSimple, buildModelValidator } from 'src/api/utils/modelUtils';
import { buildOptionalDecoderModel } from 'src/api/utils/commonModelValidators';

const ActivePendingDepositLimit = buildValidator('', t.interface({
    amount: t.number,
    currency: t.string,
    lastUpdateDate: t.string,
    periodEndDate: t.string,
    periodStartDate: t.string,
    status: t.string,
    type: t.string,
    used: t.number
}));
export type ActivePendingDepositLimitType = ReturnType<typeof ActivePendingDepositLimit>;

const InactiveDepositLimit = buildValidator('', t.interface({
    status: t.string,
    type: t.string,
}));
export type InactiveDepositLimitType = ReturnType<typeof InactiveDepositLimit>;

const depositLimit = buildModelValidator('depositLimit', {
    active: buildApiItemDefault(buildOptionalDecoderModel(ActivePendingDepositLimit), null),
    inactive: buildApiItemDefault(buildOptionalDecoderModel(InactiveDepositLimit), null),
    pending: buildApiItemDefault(buildOptionalDecoderModel(ActivePendingDepositLimit), null),
});
export type DepositLimitType = ReturnType<typeof depositLimit>;

const modelConfig = { 
    daily: buildApiItemSimple(buildOptionalDecoderModel(depositLimit)),
    monthly: buildApiItemSimple(buildOptionalDecoderModel(depositLimit)),
    weekly: buildApiItemSimple(buildOptionalDecoderModel(depositLimit)),
};

export const decodeAccountDepositLimitsDataModel = buildModelValidator('AccountsDepositLimitsData', modelConfig);

export type AccountDepositLimitsDataModelType = ReturnType<typeof decodeAccountDepositLimitsDataModel>;
