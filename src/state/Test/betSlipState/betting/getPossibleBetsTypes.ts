import { buildValidator } from "src/state/Test/utils/buildValidator";
import * as t from 'io-ts';
import { PriceIO, CountryIO, CurrencyIO, ErrorIO, FreeBetCreditsIO, FreeBetRemarksIO, SmallLegIO, RabLegIO } from "src/state/Test/betSlipState/BetSlipSheredTypes";
import { ErrorsIO } from "src/state/Test/betSlipState/BetSlipTypes";
import { RabBetType } from "./postPlaceBet";

export const BetIO = t.interface({
    id: t.string,
    type: t.string,
    stakePerLine: t.number,
    payout: t.union([t.undefined, t.number, t.null]),
    eachWay: t.boolean,
    legs: t.array(SmallLegIO),
    ip: t.string,
    channel: t.string,
    country: CountryIO,
    currency: CurrencyIO,
    correlationId: t.union([t.string, t.undefined]),
    price: t.union([PriceIO, t.null]),
    maxStake: t.union([t.null, t.undefined, t.number]),
    potentialReturns: t.union([t.undefined, t.null, t.number]),
    potentialReturnsEw: t.union([t.undefined, t.null, t.number]),
    tax: t.union([t.undefined, t.number, t.null]),
    totalStake: t.union([t.undefined, t.number, t.null]),
    errors: t.array(ErrorIO),
    freebetCredits: t.array(FreeBetCreditsIO),
    freebetRemarks: t.array(FreeBetRemarksIO),
    selection: t.union([t.undefined, t.null, t.interface({id: t.number})]),
});

export type BetResponseType = t.TypeOf<typeof BetIO>;

export type BetResponseExtendedType = BetResponseType & {numLines: number};

const ParsedLegsIO = t.interface({
    eachWay: t.boolean,
    potentialReturns: t.union([ t.number, t.null ]),
    potentialReturnsAt: t.number,
    freebetCredits: t.union([ t.array(FreeBetCreditsIO), t.undefined ]),
    freebetRemarks: t.union([ t.array(FreeBetRemarksIO), t.undefined ]),
    errors: t.union([ t.array(ErrorIO), t.undefined ]),
    maxStake: t.union([ t.number, t.null ]),
    price: t.union([ PriceIO, t.null ]),
    // related: t.boolean,
    // 'singles-only': t.union([ t.boolean, t.undefined ])
});

export type ParsedLegsType = t.TypeOf<typeof ParsedLegsIO>;


export const BetsForConvertBetsIO = t.interface({
    id: t.string,
    type: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    // legs: t.array(ErrorLegIO),
    ip: t.string,
    channel: t.string,
    country: CountryIO,
    currency: CurrencyIO,
    correlationId: t.string,
    price: t.union([PriceIO, t.null]),
    maxStake: t.union([t.null, t.number]),
    errors: t.array(ErrorIO),

    // potentialReturns: t.number,
    // potentialReturnsEw: t.null,
    // tax: t.union([t.number, t.null]),
    // totalStake: t.number,
    // freebetCredits: t.union([t.undefined, t.array(FreeBetCreditsIO)]),
    // freebetRemarks: t.union([t.undefined, t.array(FreeBetRemarksIO)]),
});

export type BetsForConvertBets = t.TypeOf<typeof BetsForConvertBetsIO>;

const ParsedCombinationsIO = t.interface({
    type: t.string,
    ewOffered: t.boolean,
    name: t.string,
    potentialReturns: t.union([ t.number, t.null ]),
    potentialReturnsEw: t.union([ t.number, t.null ]),
    potentialReturnsAt: t.union([ t.number, t.undefined ]),
    maxStake: t.union([ t.number, t.undefined]),
    numLines: t.number,
    legs: t.array(SmallLegIO),
    freebetCredits: t.union([ t.array(FreeBetCreditsIO), t.undefined]),
    freebetRemarks: t.union([ t.array(FreeBetRemarksIO), t.undefined]),
    errors: t.union([ t.array(ErrorIO), t.undefined]),
    price: t.union([PriceIO, t.undefined])
});

export type ParsedCombinationsType = t.TypeOf<typeof ParsedCombinationsIO>;

const PlayableBalanceAmountsIO = t.interface({
    requiredAmount: t.union([t.null, t.undefined, t.number]),
    currentAmount: t.union([t.null, t.undefined, t.number])
});

export type PlayableBalanceAmountsType = t.TypeOf<typeof PlayableBalanceAmountsIO>;

export const ErrorRawIO = t.interface({
    code: t.string,
    debugDetails: t.union([t.null, t.unknown]),
    details: t.union([t.null, PlayableBalanceAmountsIO, t.undefined]),
    field: t.union([t.null, t.unknown]),
    leg: t.unknown,
    pointer: t.union([t.string, t.null, t.undefined]),
    resource: t.string,
});

export type ErrorRawType = t.TypeOf<typeof ErrorRawIO>;

const RabRawIO = t.interface({
    channel: t.string,
    eachWay: t.boolean,
    legs: t.union([t.undefined, t.array(RabLegIO)]),
    stakePerLine: t.union([t.undefined, t.number]),
    type: t.string,
    payout: t.union([t.number, t.undefined, t.null]),
    platformId: t.union([t.string, t.undefined, t.null]),
    freebetCredits: t.array(FreeBetCreditsIO),
    freebetRemarks: t.array(FreeBetRemarksIO),
    correlationId: t.string,
});

const ParsedPossibleBetsIO = t.interface({
    combinations: t.record(t.string, ParsedCombinationsIO),
    legs: t.record(t.string, ParsedLegsIO),
    related: t.boolean,
    singlesOnly: t.boolean,
    playableBalanceAmounts: t.union([PlayableBalanceAmountsIO, t.null, t.undefined]),
    bets: t.array(BetIO),
    relatedOnAdd: t.boolean,
    errors: t.array(ErrorRawIO),
    rabBets:  t.union([t.array(RabRawIO), t.undefined, t.null])
});

export type ParsedPossibleBetsType = t.TypeOf<typeof ParsedPossibleBetsIO>;

export const decodeResponseGetPossibleBets = buildValidator('API - getPossibleBets', ParsedPossibleBetsIO, true);

const CombinationsForPossibleBets = t.interface({
    legs: t.array(SmallLegIO),
    potentialReturns: t.number,
    price: t.union([ PriceIO, t.null ]),
    ewOffered: t.boolean,
    name: t.string,
    maxStake: t.union([ t.number, t.null ]),
    stakePerLine: t.number,
    potentialReturnsEw: t.union([ t.number, t.null ]),
    potentialReturnsAt: t.union([ t.number, t.null ]),
    numLines: t.number,
    type: t.string,
    eachWay: t.boolean,
    freebetCredits: t.array(FreeBetCreditsIO),
    freebetRemarks: t.array(FreeBetRemarksIO),
});

export type CombinationsForPossibleBetsType = t.TypeOf<typeof CombinationsForPossibleBets>;


const LegsForPossibleBets = t.interface({
    eventId: t.number,
    marketId: t.number,
    selectionId: t.number,
    id: t.number,
    priceType: t.string,
    timestamp: t.number,
    stakePerLine: t.number,
    potentialReturns: t.union([ t.number, t.null ]),
    related: t.boolean,
    errors: t.array(ErrorsIO),
    eachWay: t.boolean,
    freebetCredits: t.array(FreeBetCreditsIO),
    freebetRemarks: t.array(FreeBetRemarksIO),
    maxStake: t.union([ t.number, t.null ]),
    potentialReturnsAt: t.number,
    price: t.union([ PriceIO, t.null, t.undefined ]),
    oldPrice: t.union([ PriceIO, t.null ]),
    name: t.string,
    potentialReturnsEw: t.number,
    type: t.string,
    index: t.union([t.number, t.null]),
});

export type LegsForPossibleBetsType = t.TypeOf<typeof LegsForPossibleBets>;


const BetsFromLocalStorageIO = t.interface({
    combinations: t.array(CombinationsForPossibleBets),
    legs: t.array(LegsForPossibleBets),
});

export type BetsFromLocalStorageType = t.TypeOf<typeof BetsFromLocalStorageIO>;


export const decodeBetsFromLocalStorage = buildValidator('API - betsFromLocalStorage', BetsFromLocalStorageIO, true);


export type GetPossibleBetsLegsRequestType = LegsForPossibleBetsType;
export type CombinationsRequestType = CombinationsForPossibleBetsType;


export interface GetPossibleBetsRequestType {
    legs: GetPossibleBetsLegsRequestType[];
    combinations: Record<string, CombinationsRequestType>;
    channel: string;
    isFreeBet: boolean;
    isFreeBetTax: boolean;
    rabBets: Array<RabBetType>;
}

interface ErrorResponseBodyType {
    status: "error";
    data: Record<string, string>;
}

interface SuccessResponseBodyType {
    status: 'success',
    data: ParsedPossibleBetsType,
}

export type BettingPossibleBetsType = SuccessResponseBodyType | ErrorResponseBodyType | null;

const CombinationRawIO = t.interface({
    type: t.string,
    name: t.string,
    ewOffered: t.boolean,
    legs: t.union([t.undefined, t.array(SmallLegIO)]),
    numLines: t.number,
    delay: t.number,
    visibleForCustomer: t.union([t.undefined, t.boolean, t.null]),
    visibleForBackend: t.union([t.undefined, t.boolean, t.null]),
    potentialReturns: t.union([t.number, t.null, t.undefined]),
    potentialReturnsEw: t.union([t.number, t.null, t.undefined]),
    maxStake: t.union([t.undefined, t.null, t.number]),
    price: t.union([t.undefined, t.null, PriceIO]),
    eachWay: t.union([t.undefined, t.boolean]),
    stakePerLine: t.union([t.undefined, t.number]),
    freebetCredits: t.union([t.undefined, t.null, t.array(FreeBetCreditsIO)]),
    freebetRemarks: t.union([t.undefined, t.null, t.array(FreeBetRemarksIO)]),
    errors: t.union([t.null, t.undefined, t.array(ErrorIO)]),
});

// const RabRawIO = t.interface({
//     channel: t.string,
//     eachWay: t.boolean,
//     legs: t.union([t.undefined, t.array(RabLegIO)]),
//     stakePerLine: t.union([t.undefined, t.number]),
//     type: t.string,
//     payout: t.union([t.undefined, t.number, t.null]),
//     platformId: t.union([t.string, t.undefined, t.null]),
// });

export type CombinationRawType = t.TypeOf<typeof CombinationRawIO>;
export type RabRawType = t.TypeOf<typeof RabRawIO>;

export const ResponseBodyIO = t.interface({
    success: t.boolean,
    bets: t.array(BetIO),
    combinations: t.record(t.string, CombinationRawIO),
    errors: t.array(ErrorRawIO),
    rabBets: t.array(RabRawIO)
});

export type ResponseBodyType = t.TypeOf<typeof ResponseBodyIO>;


const ResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: ResponseBodyIO,
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: ResponseBodyIO
    }),
    t.interface({
        status: t.literal(500),
        bodyJson: t.interface({})
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.interface({})
    })
]);

export const decodeRawResponseGetPossibleBets = buildValidator('getPossibleBets -> ResponseIO', ResponseIO, true);

const ResponseBodyTempIO = t.interface({
    success: t.boolean,
    bets: t.array(t.unknown),
    combinations: t.record(t.string, t.unknown),
    errors: t.array(t.unknown),
    rabBets: t.array(RabRawIO)
});

export type PossibleBetsResponseBodyTypes = t.TypeOf<typeof ResponseBodyTempIO>;









// ----------- for new request

export const SmallLegStrictIO = t.interface({
    type: t.union([t.undefined, t.string]),
    selection: t.union([t.undefined, t.interface({id: t.number})]),
    market: t.union([t.undefined, t.interface({id: t.number})]),
    event: t.union([t.undefined, t.interface({id: t.number})]),
    price: t.union([t.undefined, PriceIO ]),
    priceType: t.string,
});

export type SmallLegStrictType = t.TypeOf<typeof SmallLegStrictIO>;

export const SmallLegStrictWithEachWayIO = t.interface({
    type: t.union([t.undefined, t.string]),
    selection: t.union([t.undefined, t.interface({id: t.number})]),
    market: t.union([t.undefined, t.interface({id: t.number})]),
    event: t.union([t.undefined, t.interface({id: t.number})]),
    price:  t.union([t.undefined, PriceIO ]),
    priceType: t.string,
    eachWay: t.boolean
});

export type SmallLegStrictWithEachWayType = t.TypeOf<typeof SmallLegStrictWithEachWayIO>;

export const LegCombinationsForRequestIO = t.interface({
    id: t.union([ t.string, t.null ]),
    legs: t.array(SmallLegStrictWithEachWayIO),
    eachWay: t.boolean
});

export type LegCombinationsForRequestType = t.TypeOf<typeof LegCombinationsForRequestIO>;

const AccountDataIO = t.interface({
    currency: t.string,
    country: t.string,
    id: t.union([t.number, t.null]),
});

export type AccountDataTypes = t.TypeOf<typeof AccountDataIO>;

const BetsForRequestIO = t.interface({
    id: t.string,
    type: t.string,
    freebetCredits: t.array(FreeBetCreditsIO),
    freebetRemarks: t.array(FreeBetRemarksIO),
    stakePerLine: t.number,
    payout: t.union([t.number, t.undefined, t.null]),
    eachWay: t.boolean,
    legs: t.array(SmallLegStrictIO),
    ip: t.string,
    channel: t.string,
    country: t.union([t.string, t.null, t.undefined]),
    currency: t.string,
    correlationId: t.string,

    // price: t.union([ PriceIO, t.null ]),
    // maxStake: t.union([ t.number, t.null ]),
    // errors: t.union([t.undefined, t.array(t.interface({}))]),
    // potentialReturns: t.union([ t.null, t.number ]),
    // potentialReturnsEw: t.union([ t.null, t.number ]),
    // tax: t.union([ t.null, t.number ]),
    // totalStake: t.union([ t.null, t.number ]),
});

export type BetsForRequestType = t.TypeOf<typeof BetsForRequestIO>;


export const GetPossibleBetsRequestNewIO = t.interface({
    channel: t.string,
    isFreeBet: t.boolean,
    isFreeBetTax: t.boolean,
    accountData: AccountDataIO,
    bets: t.array(BetsForRequestIO),
    legCombinations: t.array(LegCombinationsForRequestIO),
    rabBets: t.union([t.array(RabRawIO), t.undefined, t.null])
});
export type GetPossibleBetsRequestNewType = t.TypeOf<typeof GetPossibleBetsRequestNewIO>;

export const decodeRequestBody = buildValidator('API - decodeRequestBody', GetPossibleBetsRequestNewIO, true);


// export interface GetPossibleBetsRequestNewType {
//     channel: string;
//     isFreeBet: boolean;
//     isFreeBetTax: boolean;
//     accountData: AccountDataTypes,
//     bets: Array<BetsForRequestType>,
//     selectedLegs: Array<SmallLegStrictWithEachWayType>
// }
