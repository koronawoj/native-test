import * as t from 'io-ts';
import { RabMarketSelectionTypeIO } from 'src/state/Test/websocket2/modelsApi/RabMarket';

export const PriceIO = t.union([t.interface({
    d: t.number,
    f: t.string,
}), t.null]);

const RabMarketIO = t.interface ({
    marketType: t.union([t.string, t.undefined]),
    name: t.union([t.string, t.undefined]),
    bettable: t.union([t.string, t.undefined]),
    period: t.union([t.string, t.undefined]),
});

const RabSingleSelectionIO = t.interface ({
    name: t.string,
    selectionType: RabMarketSelectionTypeIO
});

const RabSelectionsIO = t.interface({
    market: RabMarketIO,
    selection: RabSingleSelectionIO
});


export type PriceType = t.TypeOf<typeof PriceIO>;

export const SmallLegIO = t.interface({
    type: t.union([t.undefined, t.string]),
    selection: t.union([t.undefined, t.interface({ id: t.number })]),
    market: t.union([t.undefined, t.interface({ id: t.number })]),
    event: t.union([t.undefined, t.interface({ id: t.number })]),
    price:  t.union([ PriceIO, t.undefined, t.null ]),
    priceType: t.union([t.undefined, t.string]),
});

export const RabLegIO = t.interface({
    type: t.union([t.undefined, t.string]),
    sport: t.interface({ id: t.string }),
    priceType: t.string,
    channel: t.string,
    event: t.interface({
        id: t.number,
        externalId: t.string
    }),
    selections: t.union([t.undefined, t.array(RabSelectionsIO)]),
    price: PriceIO
});

export type SmallLegType = t.TypeOf<typeof SmallLegIO>;


export const ErrorIO = t.interface({
    code: t.string,
    debugDetails: t.union([t.null, t.unknown]),
    details: t.union([t.null, t.unknown]),
    field: t.union([t.null, t.unknown]),
    leg: t.union([ t.undefined, SmallLegIO ]),
    pointer: t.string,
    resource: t.string,
});

export type ErrorType = t.TypeOf<typeof ErrorIO>;

export const SportInfoTypeIO = t.interface({
    id: t.union([t.string, t.number, t.undefined]),
    name: t.string,
    url: t.union([t.string, t.undefined]),
});

export const AccountTypeIO = t.interface({
    id: t.number,
    type: t.string,
    name: t.string,
});

export const EachWayTermsIO = t.interface({
    places: t.number,
    reduction: t.interface({ num: t.number, den: t.number })
});

export const FirstLegsTypeIO = t.interface({
    id: t.string,
    type: t.string,
    result:  t.union([t.null, t.undefined]),
    eachWayTerms: t.union([ t.null, EachWayTermsIO, t.undefined, t.string, t.interface({ places: t.number, reduction: t.string }) ]),
    termsWithBet: t.union([ t.null, t.boolean, t.undefined ]),
    eventCountry: t.union([t.string,t.array(t.string), t.undefined, t.array(t.interface({}))]),
    inPlay: t.boolean,
    price: t.union([ t.null, PriceIO ]),
    spPrice: t.union([t.null, t.undefined, PriceIO]),
    priceType: t.string,
    sport: t.union([SportInfoTypeIO, t.undefined]),
    competition: t.union([SportInfoTypeIO, t.undefined]),
    event: SportInfoTypeIO,
    market: t.union([SportInfoTypeIO, t.undefined]),
    selection: t.union([SportInfoTypeIO, t.undefined]),
    problems: t.union([t.array(t.interface({})), t.undefined])
});

export const CountryIO = t.union([t.interface({
    readOnly: t.boolean,
    hidden: t.boolean,
    value: t.string
}), t.string ]);

export type CountryType = t.TypeOf<typeof CountryIO>;

export const CurrencyIO = t.union([t.interface({
    readOnly: t.boolean,
    hidden: t.boolean,
    value: t.string
}), t.string ]);

export type CurrencyType = t.TypeOf<typeof CurrencyIO>;

export const FreeBetCreditsIO = t.interface({
    id: t.number,
    amount: t.number,
});

export type FreeBetCreditsType = t.TypeOf<typeof FreeBetCreditsIO>;

export const FreeBetRemarksIO = t.interface({
    resource: t.string,
    code: t.string,
    details: t.union([t.interface({
        minimum: t.number
    }), t.any]),
});

export type FreeBetRemarksType = t.TypeOf<typeof FreeBetRemarksIO>;

export const PlayableBalanceAmountsIO = t.interface({
    currentAmount: t.union([t.number, t.null, t.undefined ]),
    requiredAmount: t.union([t.number, t.null, t.undefined ]),
});

export type PlayableBalanceAmountsType = t.TypeOf<typeof PlayableBalanceAmountsIO>;

export interface ForTotalStakeTypes {
    eachWay: boolean | null,
    numLines: number | null,
    stakePerLine: number | null
}

export interface BetSlipUserDataType {
    currency: string,
    country: string,
    balance: number | null,
    accountAuthenticated: boolean,
    userId: number | null,
}
