import { decodeStringOrNull } from './../../utils/commonModelValidators';
import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import { decodeString, decodeNumber } from 'src/api/utils/commonModelValidators';

const modelConfig = {
    universe: buildApiItemDefault(decodeString, ''),
    id: buildApiItemDefault(decodeString, ''),
    url: buildApiItemDefault(decodeString, ''),
    currency: buildApiItemDefault(decodeString, ''),
    creditLimit: buildApiItemDefault(decodeNumber, 0),
    balance: buildApiItemDefault(decodeNumber, 0),
    operatorBalance: buildApiItemDefault(decodeNumber, 0),
    profit: buildApiItemDefault(decodeNumber, 0),
    operatorProfit: buildApiItemDefault(decodeNumber, 0),
    operatorAccumulatedProfit: buildApiItemDefault(decodeNumber, 0),
    operatorExternalProfit: buildApiItemDefault(decodeNumber, 0),
    fundsLocked: buildApiItemDefault(decodeNumber, 0),
    playableBalance: buildApiItemDefault(decodeNumber, 0),
    withdrawableBalance: buildApiItemDefault(decodeNumber, 0),
    transactionsUrl: buildApiItemDefault(decodeString, ''),
    assetFlowsUrl: buildApiItemDefault(decodeString, ''),
    createdAt: buildApiItemDefault(decodeString, ''),
    updatedAt: buildApiItemDefault(decodeString, ''),
    lastBetAt: buildApiItemDefault(decodeString, ''),
    betLimit: buildApiItemDefault(decodeStringOrNull, '')
};

export const decodeAccountWalletDataModel = buildModelValidator('Accounts wallet data', modelConfig);

export type AccountWalletDataModelType = ReturnType<typeof decodeAccountWalletDataModel>;
