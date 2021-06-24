import * as t from 'io-ts';
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple } from 'src/api/utils/modelUtils';
import { decodeNumber, decodeString } from 'src/api/utils/commonModelValidators';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

const decodeAggregations = buildModelValidator('', {
    total: buildApiItemDefault(decodeNumber, 0),
    totalValue: buildApiItemDefault(decodeNumber, 0)
});

const decodeNetDeposit = {
    aggregations: buildApiItemSimple(decodeAggregations),
    operatorCurrency: buildApiItemDefault(decodeString, ''),
    results: buildApiItemDefault(buildValidator('', t.unknown), []),
};

export const decodeNetDepositDataModel = buildModelValidator('NetDepositData', decodeNetDeposit);

export type NetDepositDataModelType = ReturnType<typeof decodeNetDepositDataModel>;