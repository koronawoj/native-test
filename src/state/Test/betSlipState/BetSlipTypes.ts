import * as t from 'io-ts';
import { buildValidator } from 'src/state/Test/utils/buildValidator';
import { PriceIO, CountryIO, CurrencyIO, AccountTypeIO, CountryType, CurrencyType, PriceType, PlayableBalanceAmountsIO, FreeBetCreditsIO, FreeBetRemarksIO, FreeBetCreditsType, SmallLegIO, ErrorType } from './BetSlipSheredTypes';

export const ErrorsIO = t.interface({
    code: t.string,
    debugDetails: t.union([t.null, t.unknown]),
    details: t.union([t.null, t.unknown]),
    field: t.union([t.null, t.unknown]),
    leg: t.unknown,
    pointer: t.string,
    resource: t.string,
});

export type ErrorsType = t.TypeOf<typeof ErrorsIO>;

export const LegIO = t.interface({
    eachWay: t.union([t.boolean, t.null]),
    errors: t.array(ErrorsIO),
    eventId: t.union([t.number, t.null]),
    freebetCredits: t.union([t.array(FreeBetCreditsIO), t.null]),
    freebetRemarks: t.union([t.array(FreeBetRemarksIO), t.null]),
    marketId: t.union([t.number, t.null]),
    maxStake: t.union([t.number, t.null, t.null]),
    potentialReturns: t.union([t.number, t.null]),
    potentialReturnsAt: t.union([t.number, t.null]),
    potentialReturnsEw: t.union([t.number, t.null]),
    price: t.union([PriceIO, t.null]),
    priceType: t.string,
    related: t.union([t.boolean, t.null]),
    selectionId: t.union([t.number, t.null]),
    index: t.union([t.number, t.null]),
    stakePerLine: t.union([t.number, t.undefined, t.null]),
    totalStake: t.union([t.number, t.undefined, t.null]),
    timestamp: t.union([t.number, t.null]),
    numLines: t.union([t.number, t.null]),
    tax: t.union([t.number, t.null]),
    uuid: t.union([t.string, t.null]),
});

export type LegType = t.TypeOf<typeof LegIO>;

export const CombinationsIO = t.interface({
    errors: t.union([t.array(ErrorsIO), t.null]),
    ewOffered: t.boolean,
    eachWay: t.union([t.boolean, t.null]),
    freebetCredits: t.union([t.array(FreeBetCreditsIO), t.null]),
    freebetRemarks: t.union([t.array(FreeBetRemarksIO), t.null]),
    legs: t.union([t.array(SmallLegIO), t.null]),
    maxStake: t.union([t.number, t.null]),
    name: t.string,
    numLines: t.number,
    potentialReturns: t.union([t.number, t.null]),
    potentialReturnsAt: t.union([t.number, t.null]),
    potentialReturnsEw: t.union([t.number, t.null]),
    price: t.union([PriceIO, t.null]),
    stakePerLine: t.union([t.number, t.null]),
    totalStake: t.union([t.number, t.null]),
    tax: t.union([t.number, t.null]),
    type: t.string,
});

export type CombinationsType = t.TypeOf<typeof CombinationsIO>;



export const CastBetIO = t.interface({
    channel: t.string,
    correlationId: t.union([t.string, t.null]),
    country: t.union([t.string, CountryIO, t.null]),
    currency: t.union([t.string, CurrencyIO, t.null]),
    eachWay: t.boolean,
    freebetCredits: t.union([t.array(FreeBetCreditsIO), t.null]),
    freebetRemarks: t.union([t.array(FreeBetRemarksIO), t.null]),
    id: t.string,
    ip: t.string,
    legs: t.array(t.unknown),
    maxStake: t.union([t.number, t.null]),
    potentialReturns: t.union([t.number, t.null]),
    potentialReturnsEw: t.union([t.number, t.null]),
    totalStake: t.union([t.number, t.null]),
    tax: t.union([t.number, t.null]),
    price: t.union([PriceIO, t.null]),
    stakePerLine: t.number,
    type: t.string,
});

export type CastBetTypeIO = t.TypeOf<typeof CastBetIO>;

export const OfferBetIO = t.interface({
    combinations: t.union([t.record( t.string, t.union([CombinationsIO, t.null])), t.null]),
    expiresAt: t.union([t.null, t.string,]),
    legs: t.union([t.null, t.record(t.string, t.union([t.null, LegIO]))]),
    status: t.string,
    user: t.union([t.null, t.unknown, t.undefined]),
});

export type OfferBetType = t.TypeOf<typeof OfferBetIO>;

export const ErrorsBetIO = t.interface({
    code: t.string,
    debugDetails: t.union([t.null, t.unknown, t.undefined]),
    details: t.union([t.null, t.unknown, t.undefined]),
    field: t.union([t.null, t.unknown, t.undefined]),
    pointer: t.union([t.null, t.unknown, t.undefined]),
    resource: t.string,
});

export type ErrorsBetType = t.TypeOf<typeof ErrorsBetIO>;

// export const PlayableBalanceAmountsIO = t.interface({
//     currentAmount: t.number,
//     requiredAmount: t.number
// });

// export type PlayableBalanceAmountsType = t.TypeOf<typeof PlayableBalanceAmountsIO>;

export const BetReceiptIO = t.interface({
    totalStake: t.number,
    totalPotentialReturns: t.union([t.number, t.string]),
    isFreeBet: t.boolean,
});

export type BetReceiptType = t.TypeOf<typeof BetReceiptIO>;

export const BettingModelTypeIO = t.interface({
    combinations: t.union([t.record( t.string, CombinationsIO), t.undefined]),
    legs: t.union([t.record( t.string, LegIO), t.undefined]),
    castBets: t.array(CastBetIO),
    playableBalanceAmounts: t.union([PlayableBalanceAmountsIO, t.null]),
    related: t.union([t.boolean, t.undefined]),
    relatedOnAdd: t.union([t.boolean, t.undefined]),
    singlesOnly: t.union([t.boolean, t.undefined]),
    offer: t.union([OfferBetIO, t.null]),
    channel: t.union([t.string, t.undefined]),
    errors: t.array(t.union([ErrorsBetIO, t.string])),
    placeBetStatus: t.union([t.string, t.null]),
    showQuickBet: t.union([t.boolean, t.undefined]),
    betReceipt: t.union([BetReceiptIO, t.undefined]),
});

export type BettingModelType = t.TypeOf<typeof BettingModelTypeIO>;

export const decodeBettingModelType = buildValidator('BettingModelType', BettingModelTypeIO);

export const SuccessSportInfoModelBetSlipTypeIO = t.interface({
    id: t.string,
    name: t.string,
    url: t.string,
});

export const SuccessBetsLegBetSlipTypeIO = t.interface({
    id: t.string,
    type: t.string,
    result: t.null,
    eachWayTerms: t.null,
    termsWithBet: t.null,
    eventCountry: t.union([t.string,t.array(t.string), t.array(t.interface({}))]),
    inPlay: t.boolean,
    price: PriceIO,
    spPrice: t.null,
    priceType: t.string,
    sport: SuccessSportInfoModelBetSlipTypeIO,
    competition: SuccessSportInfoModelBetSlipTypeIO,
    event: SuccessSportInfoModelBetSlipTypeIO,
    market: SuccessSportInfoModelBetSlipTypeIO,
    selection: SuccessSportInfoModelBetSlipTypeIO,
    problems: t.array(t.interface({})),
});

export const SuccessBetsBetSlipTypeIO = t.interface({
    id: t.number,
    type: t.string,
    currency: t.string,
    stakePerLine: t.number,
    operatorStakePerLine: t.number,
    numLines: t.number,
    totalStake: t.number,
    operatorTotalStake: t.number,
    legs: t.array(SuccessBetsLegBetSlipTypeIO),
    eachWay: t.boolean,
    status: t.string,
    settledAt: t.null,
    settledBy: t.null,
    placedAt: t.null,
    placedBy: AccountTypeIO,
    account: AccountTypeIO,
    comment: t.null,
    country: t.string,
    channel: t.string,
    stakeFactor: t.number,
    maxBet: t.number,
    potentialReturns: t.number,
    cashOut: t.boolean,
    payout: t.null,
    operatorPayout: t.null,
    remarks: t.array(t.interface({})),
    freebet: t.boolean,
});

export type SuccessBetsBetSlipTypeType = t.TypeOf<typeof SuccessBetsBetSlipTypeIO>;

export const ReferralLegTypeIO = t.interface({
    type: t.string,
    sport: t.null,
    eachWayTerms: t.null,
    termsWithBet: t.null,
    eventCountry: t.union([t.string,t.array(t.string), t.array(t.interface({}))]),
    price: PriceIO,
    priceType: t.string,
    eventId: t.number,
    marketId: t.string,
    selectionId: t.string,
    id: t.string,
    index: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    potentialReturns: t.union([t.null, t.undefined, t.number]),
});

export type ReferralLegType = t.TypeOf<typeof ReferralLegTypeIO>;

export const ReferralCombinationTypeIO = t.interface({
    type: t.string,
    correlationID: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    comment: t.null,
    country: t.union([t.undefined, t.null, t.string]),
    channel: t.string,
    potentialReturns: t.union([t.null, t.number]),
    tax: t.union([t.undefined, t.number]),
    name: t.union([t.undefined, t.string]),
    freebet: t.boolean,
    legs: t.union([t.undefined, t.array(SmallLegIO)]),
});

export type ReferralCombinationType = t.TypeOf<typeof ReferralCombinationTypeIO>;

export const ReferralTypeIO = t.interface({
    legs: t.record(t.string, ReferralLegTypeIO),
    combinations: t.record(t.string, ReferralCombinationTypeIO),
    channel: t.string,
});


export const ReferralTypeModelIO = t.interface({
    combinations: t.record(t.string, ReferralCombinationTypeIO),
    legs: t.record(t.string, ReferralLegTypeIO),
    expiresAt: t.union([t.string, t.null, t.undefined]),
    status: t.string,
    user: t.string,
});

export type ReferralTypeModel = t.TypeOf<typeof ReferralTypeModelIO>;

export type ReferralType = t.TypeOf<typeof ReferralTypeIO>;

export const decodeReferralType = buildValidator('ReferralModelType', ReferralTypeIO);



interface FreeBetRemarksType {
    resource: string,
    code: string,
    details: {
        minimum: number
    } | unknown
}

export interface CastBetType {
    channel: string,
    correlationId: string | null,
    country: string | CountryType | null,
    currency: string | CurrencyType | null,
    eachWay: boolean,
    freebetCredits: Array<FreeBetCreditsType> | null,
    freebetRemarks: Array<FreeBetRemarksType> | null,
    id: string,
    ip: string,
    legs: Array<unknown>,
    maxStake: number | null,
    potentialReturns: number | null,
    potentialReturnsEw: number | null,
    totalStake: number | null,
    tax: number | null,
    price: PriceType | null,
    stakePerLine: number,
    type: string,
    numLines: number,
    errors: Array<ErrorType>,
}
