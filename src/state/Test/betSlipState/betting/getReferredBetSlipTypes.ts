import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import * as t from 'io-ts';
import { PriceIO, FirstLegsTypeIO, AccountTypeIO } from "src/appState/betSlipState/BetSlipSheredTypes";


export const SuccessResponseTypeIO = t.interface({
    id: t.number,
    type: t.string,
    currency: t.string,
    stakePerLine: t.number,
    operatorStakePerLine: t.number,
    numLines: t.number,
    totalStake: t.number,
    operatorTotalStake: t.number,
    legs: t.array(FirstLegsTypeIO),
    eachWay: t.boolean,
    status: t.string,
    settledAt: t.null,
    settledBy: t.null,
    placedAt: t.union([t.string, t.null]),
    placedBy: t.union([AccountTypeIO, t.null]),
    account: AccountTypeIO,
    ip: t.union([t.string, t.undefined, t.null]),
    comment: t.null,
    country: t.string,
    channel: t.string,
    stakeFactor: t.number,
    maxBet: t.number,
    potentialReturns: t.number,
    cashOut: t.boolean,
    payout: t.null,
    operatorPayout: t.null,
    profit: t.null,
    operatorProfit: t.null,
    remarks: t.array(t.interface({})),
    freebet: t.union([t.boolean, t.undefined]),
    transaction: t.union([t.unknown, t.undefined])
});

export type SuccessPlaceBetResponseType = t.TypeOf<typeof SuccessResponseTypeIO>;

export const ReferredBetSlipBetLegTypeIO = t.interface({
    type: t.string,
    sport: t.null,
    eachWayTerms: t.null,
    termsWithBet: t.null,
    eventCountry: t.union([t.string, t.array(t.string), t.array(t.interface({}))]),
    price: PriceIO,
    priceType: t.string,
    eventId: t.union([t.number, t.undefined]),
    marketId: t.union([t.string, t.undefined]),
    selectionId: t.union([t.string, t.undefined]),
    id: t.union([t.string, t.undefined]),
    index: t.union([t.string, t.undefined]),
    stakePerLine: t.union([t.number, t.undefined]),
    eachWay: t.union([t.string, t.undefined]),
    potentialReturns: t.union([t.number, t.undefined]),
});

export type ReferredBetSlipBetLegType = t.TypeOf<typeof ReferredBetSlipBetLegTypeIO>;

export const ReferredBetSlipBetTypeIO = t.interface({
    type: t.string,
    correlationID: t.string,
    stakePerLine: t.number,
    legs: t.array(ReferredBetSlipBetLegTypeIO),
    eachWay: t.boolean,
    comment: t.null,
    country:  t.union([t.string, t.null, t.undefined]),
    channel: t.string,
    potentialReturns: t.union([t.number, t.null]),
    freebet: t.boolean,
});

export type ReferredBetSlipBetType = t.TypeOf<typeof ReferredBetSlipBetTypeIO>;

export const ReferredBetSlipAccountTypeIO = t.interface({
    id: t.number,
    type: t.string,
    name: t.string,
});

export const ReferredHeaderWhoBetSlipTypeIO = t.interface({
    id: t.number,
    name: t.string,
    type: t.string,
    universe: t.string,
    ip: t.string,
});

export const ReferredHeaderBetSlipTypeIO = t.interface({
    id: t.string,
    type: t.string,
    universe: t.string,
    when: t.string,
    who: ReferredHeaderWhoBetSlipTypeIO,
    clientRequestId: t.null,
});

export const ReferredBetSlipTypeIO = t.interface({
    type: t.string,
    account: ReferredBetSlipAccountTypeIO,
    assignee: t.union([t.null, ReferredBetSlipAccountTypeIO]),
    bets: t.array(ReferredBetSlipBetTypeIO),
    createdAt: t.string,
    expiresAt: t.union([t.null, t.string]),
    ignoreProblems: t.array(t.interface({})),
});

export const ReferralModelTypeIO = t.interface({
    body: t.interface({
        referredBetslip: ReferredBetSlipTypeIO,
        bets: t.array(SuccessResponseTypeIO),
    }),
    header: ReferredHeaderBetSlipTypeIO,
});

export type ReferralModelType = t.TypeOf<typeof ReferralModelTypeIO>;

export const decodeReferralModelType = buildValidator('ReferralModelType', ReferralModelTypeIO);