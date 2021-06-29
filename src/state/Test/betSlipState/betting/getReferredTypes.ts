import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import * as t from 'io-ts';
import { PriceIO } from "src/appState/betSlipState/BetSlipSheredTypes";


const ResponseAssigneeIO = t.interface({
    id: t.number,
    type: t.string,
    name: t.string,
});

const SelectionEventMarketIO = t.interface({
    id: t.number,
    name: t.string,
});

const ResponseLegIO = t.interface({
    type: t.string,
    price: PriceIO,
    priceType: t.string,
    eventId: t.number,
    marketId: t.number,
    selectionId: t.number,
    selection: t.union([t.undefined, SelectionEventMarketIO]),
    event: t.union([t.undefined, SelectionEventMarketIO]),
    market: t.union([t.undefined, SelectionEventMarketIO])
});

export type ResponseLegType = t.TypeOf<typeof ResponseLegIO>;

const ResponseBetIO = t.interface({
    type: t.string,
    stakePerLine: t.number,
    legs: t.array(ResponseLegIO),
    eachWay: t.boolean,
    ip: t.union([t.string, t.null, t.undefined]),
    country: t.union([t.string, t.undefined, t.null]),
    channel: t.string,
    affiliate: t.union([t.null, t.undefined]),
    potentialReturns: t.union([t.number, t.null, t.undefined]),
    freebetCredits: t.array(t.interface({})),
});

export type ResponseBetType = t.TypeOf<typeof ResponseBetIO>;


const ResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.interface({
            type: t.string,
            bets: t.array(ResponseBetIO),
            createdAt: t.union([t.string, t.null]),
            expiresAt: t.union([t.string, t.null, t.undefined]),
            assignee: t.union([ResponseAssigneeIO, t.null, t.undefined]),
            acceptUrl: t.union([t.string, t.null]),
            rejectUrl: t.union([t.string, t.null]),
            assignUrl: t.union([t.string, t.null, t.undefined]),
            when: t.string,
        })
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.interface({})
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({})
    }),
    t.interface({
        status: t.literal(401),
        bodyJson: t.interface({})
    })
]);


export const decodeReferredBetSlipResponse = buildValidator('getReferredBetSlip -> ResponseIO', ResponseIO, true);



const ErrorLegIO = t.interface({
    index: t.number,
    selection: t.interface({id: t.number}),
    market: t.interface({id: t.number}),
    event: t.interface({id: t.number})
});

const ErrorIO = t.interface({
    code: t.string,
    debugDetails: t.union([t.null, t.unknown]),
    details: t.union([t.null, t.unknown]),
    field: t.union([t.null, t.unknown]),
    leg: ErrorLegIO,
    pointer: t.string,
    resource: t.string,
});

export type ErrorType = t.TypeOf<typeof ErrorIO>;

const FreeBetCreditsIO = t.interface({
    id: t.number,
    amount: t.number,
});

export type FreeBetCreditsType = t.TypeOf<typeof FreeBetCreditsIO>;

const FreeBetRemarksIO = t.interface({
    resource: t.string,
    code: t.string,
    details: t.union([t.interface({
        minimum: t.number
    }), t.unknown]),
});

export type FreeBetRemarksType = t.TypeOf<typeof FreeBetRemarksIO>;

const CountryIO = t.union([t.interface({
    readOnly: t.boolean,
    hidden: t.boolean,
    value: t.string
}), t.string ]);

export type CountryType = t.TypeOf<typeof CountryIO>;

const CurrencyIO = t.union([t.interface({
    readOnly: t.boolean,
    hidden: t.boolean,
    value: t.string
}), t.string ]);

export type CurrencyType = t.TypeOf<typeof CurrencyIO>;

const LegIO = t.interface({
    type: t.string,
    selection: t.interface({id: t.number}),
    market: t.interface({id: t.number}),
    event: t.interface({id: t.number}),
    price:  t.union([ PriceIO, t.undefined, t.null ]),
    priceType: t.string
});

export type LegSmallType = t.TypeOf<typeof LegIO>;

export const BetIO = t.interface({
    id: t.string,
    type: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    legs: t.array(LegIO),
    ip: t.string,
    channel: t.string,
    country: CountryIO,
    currency: CurrencyIO,
    correlationId: t.string,
    price: t.union([PriceIO, t.null]),
    maxStake: t.union([t.null, t.number]),
    potentialReturns: t.union([t.undefined, t.null, t.number]),
    potentialReturnsEw: t.union([t.undefined, t.null, t.number]),
    tax: t.union([t.undefined, t.number]),
    totalStake: t.union([t.undefined, t.number]),
    errors: t.union([t.undefined, t.array(ErrorIO)]),
    freebetCredits: t.union([t.undefined, t.array(FreeBetCreditsIO)]),
    freebetRemarks: t.union([t.undefined, t.array(FreeBetRemarksIO)]),
    selection: t.union([t.undefined, t.interface({id: t.number})])
});

export type BetResponseType = t.TypeOf<typeof BetIO>;

export type BetResponseExtendedType = BetResponseType & {numLines: number};


const ReferralParsedLegsIO = t.interface({
    type: t.string,
    price: t.union([ PriceIO, t.null ]),
    priceType: t.string,
    index: t.union([t.number, t.string]),
    stakePerLine: t.number,
    eachWay: t.boolean,
    empty: t.union([t.boolean, t.null, t.undefined]),
    selectionName: t.union([ t.string, t.undefined ]),
    eventName: t.union([ t.string, t.undefined ]),
    id: t.union([t.string, t.number, t.null]),
    eventId: t.union([t.number, t.null]),
    marketId: t.union([t.number, t.null]),
    selectionId: t.union([t.number, t.null]),
    potentialReturns: t.union([t.number, t.null, t.undefined]),
});

export type ReferralParsedLegsType = t.TypeOf<typeof ReferralParsedLegsIO>;

const ParsedCombinationsIO = t.interface({
    type: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    ip: t.union([ t.string, t.null ]),
    potentialReturns: t.union([ t.number, t.null ]),
    freebetCredits: t.union([ t.array(FreeBetCreditsIO), t.undefined]),
});

export type ParsedCombinationsType = t.TypeOf<typeof ParsedCombinationsIO>;


const ParsedReferredBetsIO = t.interface({
    combinations: t.record(t.string, ParsedCombinationsIO),
    legs: t.record(t.string, ReferralParsedLegsIO),
    channel: t.string,
    expiresAt: t.union([ t.string, t.null, t.undefined ]),
    type: t.string
});

export type ParsedReferredBetsType = t.TypeOf<typeof ParsedReferredBetsIO>;

export const decodeResponseGetReferredBets = buildValidator('API - getReferredBets', ParsedReferredBetsIO, true);