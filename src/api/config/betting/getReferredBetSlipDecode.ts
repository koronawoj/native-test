import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import {
    decodeString,
    decodeNumber,
    buildOptionalDecoderModel,
    decodeStringOrNull,
    decodeNumberOrNull,
    decodeBoolean,
    decodeStringOrUndefined,
} from 'src/api/utils/commonModelValidators';

const decodeFreebetCredits = buildModelValidator('decodeFreebetCredits', {

});

const decodePrice = buildModelValidator('decodePrice', {
    d: buildApiItemDefault(decodeNumber, 0),
    f: buildApiItemDefault(decodeString, ''),
});

const decodeSelectionEventMarket = buildModelValidator('decodeSelectionEventMarket', {
    id: buildApiItemDefault(decodeNumber, 0),
    name: buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeLeg = buildModelValidator('decodeLeg', {
    type: buildApiItemDefault(decodeString, ''),
    price: buildApiItemDefault(decodePrice, null),
    priceType: buildApiItemDefault(decodeString, ''),
    selection: buildApiItemSimple(decodeSelectionEventMarket),
    event: buildApiItemSimple(decodeSelectionEventMarket),
    market: buildApiItemSimple(decodeSelectionEventMarket),
});

const decodeBets = buildModelValidator('decodeBets', {
    type: buildApiItemDefault(decodeString, ''),
    stakePerLine: buildApiItemDefault(decodeNumber, 0),
    legs: buildApiItemSimple(buildArrayDecoderModel(decodeLeg)),
    eachWay: buildApiItemDefault(decodeBoolean, false),
    ip: buildApiItemDefault(decodeStringOrNull, ''),
    country: buildApiItemDefault(decodeStringOrNull, ''),
    channel: buildApiItemDefault(decodeString, ''),
    affiliate: buildApiItemDefault(decodeStringOrNull, ''),
    potentialReturns: buildApiItemDefault(decodeNumberOrNull, 0),
    freebetCredits: buildApiItemSimple(buildOptionalDecoderModel(buildArrayDecoderModel(decodeFreebetCredits))),
});

const decodeAssignee = buildModelValidator('decodeAssignee', {
    id: buildApiItemDefault(decodeNumberOrNull, null),
    type: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
});

const modelConfig = {
    type: buildApiItemDefault(decodeString, ''),
    bets: buildApiItemSimple(buildArrayDecoderModel(decodeBets)),
    createdAt: buildApiItemDefault(decodeStringOrNull, ''),
    expiresAt: buildApiItemDefault(decodeStringOrNull, ''),
    assignee: buildApiItemSimple(buildOptionalDecoderModel(decodeAssignee)),
    acceptUrl: buildApiItemDefault(decodeStringOrNull, ''),
    rejectUrl: buildApiItemDefault(decodeStringOrNull, ''),
    assignUrl: buildApiItemDefault(decodeStringOrNull, ''),
    when: buildApiItemDefault(decodeStringOrNull, ''),
};

export const decodeReferredBetSlipDataModel = buildModelValidator('ReferredBetSlipData', modelConfig);
export type ReferredBetSlipDataModelType = ReturnType<typeof decodeReferredBetSlipDataModel>;

const decodeReferredBetSlipError = {
    code: buildApiItemDefault(decodeString, ''),
    debugDetails: buildApiItemDefault(decodeStringOrNull, ''),
    details: buildApiItemDefault(decodeStringOrNull, ''),
    errors: buildApiItemDefault(decodeStringOrNull, ''),
    message:  buildApiItemDefault(decodeStringOrNull, '')
};

export const decodeReferredBetSlipErrorDataModel = buildModelValidator('ReferredBetSlipErrorData', decodeReferredBetSlipError);
export type ReferredBetSlipErrorDataModelType = ReturnType<typeof decodeReferredBetSlipErrorDataModel>;

const decodeReferredBetSlipUserError = {
    errorMessage: buildApiItemDefault(decodeString, ''),
};

export const decodeReferredBetSlipUserErrorDataModel = buildModelValidator('ReferredBetSlipUserErrorData', decodeReferredBetSlipUserError);
export type ReferredBetSlipUserErrorDataModelType = ReturnType<typeof decodeReferredBetSlipUserErrorDataModel>;

// export type ReferralBets = ReturnType<typeof decodeBets>;
// export type ReferralBetsLegs = ReturnType<typeof decodeLeg>;
// export interface ReferralBetsExtended {
//     type: string,
//     stakePerLine: number,
//     legs: Array<{
//         type: string,
//         price: {
//             d: number,
//             f: string,
//         } | null,
//         priceType: string,
//         selection: {
//             id: number,
//             name: string | null | undefined,
//         },
//         event: {
//             id: number,
//             name: string | null | undefined,
//         },
//         market: {
//             id: number,
//             name: string | null | undefined,
//         },
//         selectionId: number | undefined | null,
//         eventId: number | undefined | null,
//         marketId: number | undefined | null,
//         eventName: string | undefined | null,
//         selectionName: string | undefined | null,
//     }>,
//     eachWay: boolean,
//     ip: string | null | undefined,
//     country: string | null | undefined,
//     channel: string,
//     affiliate: string | null | undefined,
//     potentialReturns: number | null | undefined,
//     // freebetCredits: unknown,
// }

const decodeRefLegsExtend = buildModelValidator('decodeLeg', {
    type: buildApiItemDefault(decodeString, ''),
    price: buildApiItemDefault(decodePrice, null),
    priceType: buildApiItemDefault(decodeString, ''),
    selection: buildApiItemSimple(decodeSelectionEventMarket),
    event: buildApiItemSimple(decodeSelectionEventMarket),
    market: buildApiItemSimple(decodeSelectionEventMarket),

    eventName: buildApiItemDefault(decodeStringOrNull, null),
    selectionName: buildApiItemDefault(decodeStringOrNull, null),
    selectionId: buildApiItemDefault(decodeNumberOrNull, null),
    eventId: buildApiItemDefault(decodeNumberOrNull, null),
    marketId: buildApiItemDefault(decodeNumberOrNull, null),
});

export type ReferralBetsLegsExtended = ReturnType<typeof decodeRefLegsExtend>;


const decodeRefBetsExtended = buildModelValidator('decodeBets', {
    type: buildApiItemDefault(decodeString, ''),
    stakePerLine: buildApiItemDefault(decodeNumber, 0),
    legs: buildApiItemSimple(buildArrayDecoderModel(decodeRefLegsExtend)),
    eachWay: buildApiItemDefault(decodeBoolean, false),
    ip: buildApiItemDefault(decodeStringOrNull, ''),
    country: buildApiItemDefault(decodeStringOrNull, ''),
    channel: buildApiItemDefault(decodeString, ''),
    affiliate: buildApiItemDefault(decodeStringOrNull, ''),
    potentialReturns: buildApiItemDefault(decodeNumberOrNull, 0),
    freebetCredits: buildApiItemSimple(buildOptionalDecoderModel(buildArrayDecoderModel(decodeFreebetCredits))),
});

export type ReferralBetsExtended = ReturnType<typeof decodeRefBetsExtended>;
