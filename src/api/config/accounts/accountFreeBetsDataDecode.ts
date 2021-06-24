import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import {
    decodeNumberOrNull,
    decodeStringOrNull,
    decodeBooleanOrNull,
    decodeString,
    decodeNumber,
    buildOptionalDecoderModel,
    decodeBoolean,
    decodeStringOrUndefined
} from 'src/api/utils/commonModelValidators';

export const decodeNewWalletAmount = buildValidator('', t.union([ t.number, t.interface({value: t.number}), t.null, t.undefined ]));

const decodeBonusCreditsHistoryChangedBy = buildModelValidator('', {
        id: buildApiItemDefault(decodeNumberOrNull, null),
        name: buildApiItemDefault(decodeStringOrNull, null),
        type: buildApiItemDefault(decodeStringOrNull, null),
});

const decodeBonusCreditsHistoryChangeBody = buildModelValidator('', {
    enabled: buildApiItemDefault(decodeBooleanOrNull, null),
    expiryDate: buildApiItemDefault(decodeStringOrNull, null),
    amountDelta: buildApiItemDefault(decodeNumberOrNull, null),
});

// const newWalletAmountDecode/*: (data: undefined) => ({value: number})*/ = buildModelValidator('', {
//     value: buildApiItemDefault(decodeNumber, 0),
// });

// const newWalletAmountDecodeOptional/*: (data: undefined) => ({value: number} | undefined | null)*/ = buildOptionalDecoderModel(newWalletAmountDecode);

const decodeBonusCreditsHistoryItem = buildModelValidator('', {
    date: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
    changedBy: buildApiItemSimple(buildOptionalDecoderModel(decodeBonusCreditsHistoryChangedBy)),
    changeBody: buildApiItemSimple(buildOptionalDecoderModel(decodeBonusCreditsHistoryChangeBody)),
    newCreditAmount: buildApiItemDefault(decodeNumberOrNull, 0),
    newWalletAmount: buildApiItemDefault(decodeNewWalletAmount, 0),
});

const decodeArrayBonusCreditsHistoryItem = buildArrayDecoderModel(decodeBonusCreditsHistoryItem);

const decodeBonusCredits = buildModelValidator('', {
    id: buildApiItemDefault(decodeNumber, 0),
    amount: buildApiItemDefault(decodeNumber, 0),
    expiryDate: buildApiItemDefault(decodeString, ''),
    promotionId: buildApiItemDefault(decodeString, ''),
    enabled: buildApiItemDefault(decodeBoolean, false),
    createdAt: buildApiItemDefault(decodeString, ''),
    updatedAt: buildApiItemDefault(decodeStringOrUndefined, ''),
    history: buildApiItemDefault(decodeArrayBonusCreditsHistoryItem, []),
    walletId: buildApiItemDefault(decodeNumber, 0),
});

const decodeBonusCreditsArray = buildArrayDecoderModel(decodeBonusCredits);

const modelConfig = {
    bonusWallet: buildApiItemDefault(
        buildValidator('', t.interface({
            id: t.number,
            universe: t.string,
            code: t.string,
            accountId: t.number,
            createdAt: t.string,
        })),
        null
    ),
    bonusCredits: buildApiItemSimple(decodeBonusCreditsArray),
    totalAmount: buildApiItemDefault(decodeNumber, 0),
};

export const decodeAccountFreeBetsDataModel = buildModelValidator('Accounts free bets data', modelConfig);

export type AccountFreeBetsDataModelType = ReturnType<typeof decodeAccountFreeBetsDataModel>;
