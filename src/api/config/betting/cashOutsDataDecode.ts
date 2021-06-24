import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import { decodeErrorResponse, decodeString, decodeSuccessResponse } from 'src/api/utils/commonModelValidators';

const CashOutIO = t.interface({
    enabled: t.boolean,
    id: t.number,
    value: t.number,
});

const decodeSuccess = buildModelValidator('decodeSuccess', {
    cashouts: buildApiItemDefault(buildValidator('', t.record(t.string, CashOutIO)),null),
});

const modelConfig = {
    data: buildApiItemSimple(decodeSuccess),
    type: buildApiItemDefault(decodeSuccessResponse, 'success'),
};

export const decodeAccountCashOutDataModel = buildModelValidator('AccountCashOutData', modelConfig);
export type CashOutMainDataModelType = ReturnType<typeof decodeAccountCashOutDataModel>;
export type CashOutDataModelType = ReturnType<typeof decodeSuccess>;
export type CashOutItemType = t.TypeOf<typeof CashOutIO>;

const decodeErrorItem = buildModelValidator('decodeErrorItem', {
    code: buildApiItemDefault(decodeString, null),
    resource: buildApiItemDefault(decodeString, null),
});

const decodeError = buildModelValidator('decodeError', {
    code: buildApiItemDefault(decodeString, null),
    errors: buildApiItemSimple(buildArrayDecoderModel(decodeErrorItem)),
    message: buildApiItemDefault(decodeString, null),
});

const accountCashOutError = {
    data: buildApiItemSimple(decodeError),
    type: buildApiItemDefault(decodeErrorResponse, 'error'),
};

export const decodeAccountCashOutErrorDataModel = buildModelValidator('AccountCashOutData', accountCashOutError);
export type AccountCashOutErrorModelType = ReturnType<typeof decodeAccountCashOutErrorDataModel>;