import { buildValidator } from 'src/state/Test/utils/buildValidator';
import * as t from 'io-ts';
import { FirstLegsTypeIO, PriceIO, AccountTypeIO, ErrorIO, CountryIO, CurrencyIO, SmallLegIO } from 'src/state/Test/betSlipState/BetSlipSheredTypes';

export const SuccessPlaceBetResponseTypeIO = t.interface({
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
    settledAt:  t.union([t.null, t.undefined]),
    settledBy:  t.union([t.null, t.undefined]),
    placedAt: t.union([t.string, t.null, t.undefined]),
    placedBy: t.union([AccountTypeIO, t.null, t.undefined]),
    account: AccountTypeIO,
    ip: t.union([t.string, t.undefined, t.null]),
    comment: t.union([t.string, t.undefined, t.null]),
    country: t.union([t.string, t.undefined, t.null]),
    channel: t.string,
    stakeFactor: t.number,
    maxBet: t.number,
    potentialReturns: t.union([ t.number, t.null, t.undefined ]),
    cashOut: t.boolean,
    payout: t.union([t.null, t.undefined, t.number]),
    operatorPayout: t.union([t.null, t.undefined]),
    profit: t.union([t.null, t.undefined]),
    operatorProfit: t.union([t.null, t.undefined]),
    remarks: t.array(t.interface({})),
    freebet: t.union([t.boolean, t.undefined]),
    transaction: t.union([t.unknown, t.undefined])
});

export type SuccessPlaceBetResponseType = t.TypeOf<typeof SuccessPlaceBetResponseTypeIO>;

export const ErrorBetPlaceBetResponseTypeIO = t.interface({
    id: t.string,
    type: t.string,
    stakePerLine: t.number,
    eachWay: t.boolean,
    legs: t.array(SmallLegIO),
    ip: t.string,
    channel: t.string,
    country: CountryIO,
    currency: CurrencyIO,
    correlationId: t.string,
    price: PriceIO,
    maxStake: t.number,
    errors: t.union([t.array(ErrorIO), t.undefined]),
    potentialReturns: t.union([ t.undefined, t.number ]),
    potentialReturnsEw: t.union([ t.undefined, t.null, t.number ]),
    tax: t.union([t.number, t.null, t.undefined]),
    totalStake: t.union([t.number, t.undefined]),
});

export type ErrorBetPlaceBetResponseType = t.TypeOf<typeof ErrorBetPlaceBetResponseTypeIO>;

export const ErrorCombinationPlaceBetResponseTypeIO = t.interface({
    type: t.string,
    name: t.string,
    ewOffered: t.boolean,
    legs: t.union([t.array(SmallLegIO), t.undefined, t.null]),
    numLines: t.number,
    delay: t.number,
    visibleForCustomer:  t.union([t.undefined, t.boolean, t.null]),
    visibleForBackend: t.union([t.undefined, t.boolean, t.null]),
    potentialReturns:  t.union([t.undefined, t.number, t.null]),
    potentialReturnsEw:  t.union([t.undefined, t.null, t.number]),
    maxStake: t.union([ t.undefined, t.number ]),
    price: t.union([ t.undefined, PriceIO ]),
});

const ErrorDebugErrorObjectTypeIO = t.interface({
    code: t.string,
    details: t.union([t.interface({ maxStakePerLine: t.union([t.number, t.undefined]) }), t.null, t.undefined]),
    field: t.union([t.string, t.null, t.undefined]),
    pointer: t.union([t.string, t.null, t.undefined]),
    resource: t.string
});

export type ErrorCombinationPlaceBetResponseType = t.TypeOf<typeof ErrorCombinationPlaceBetResponseTypeIO>;


export const ErrorPlaceBetResponseDataTypeIO = t.union([t.interface({
    possibilityError: t.boolean,
    bets: t.array(ErrorBetPlaceBetResponseTypeIO),
    combinations: t.record(t.string, ErrorCombinationPlaceBetResponseTypeIO),
}), t.undefined, t.null]);

export const ErrorDebugPlaceBetResponseTypeIO = t.union([t.interface({
    code: t.string,
    errors: t.array(ErrorDebugErrorObjectTypeIO),
    message: t.string
}), t.undefined, t.null]);;

export type ErrorPlaceBetResponseDataType = t.TypeOf<typeof ErrorPlaceBetResponseDataTypeIO>;

export type ErrorDebugPlaceBetResponseType = t.TypeOf<typeof ErrorDebugPlaceBetResponseTypeIO>

export const ErrorPlaceBetResponseTypeIO = t.interface({
    status: t.string,
    data: ErrorPlaceBetResponseDataTypeIO,
    debug: t.union([ErrorDebugPlaceBetResponseTypeIO, t.string]),
    errors: t.union([t.array(t.union([t.interface({}), t.undefined, t.null, t.string])), t.record(t.string, t.string)]),
});

export type ErrorPlaceBetResponseType = t.TypeOf<typeof ErrorPlaceBetResponseTypeIO>;

const PostPlaceBetResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.union([t.array(SuccessPlaceBetResponseTypeIO), t.null]),
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: ErrorPlaceBetResponseTypeIO
    }),
    t.interface({
        status: t.literal(500),
        bodyJson: t.interface({})
    })
]);

export const decodePostPlaceBetResponse = buildValidator('postPlaceBet -> ResponseIO', PostPlaceBetResponseIO, true);

interface ErrorResponseBodyType {
    status: 'error';
    data: ErrorPlaceBetResponseDataType;
    debug?: ErrorDebugPlaceBetResponseType | string;
}

interface SuccessResponseBodyType {
    status: 'success'
    data: Array<SuccessPlaceBetResponseType> | null,
}

export type BettingPlaceBetType = SuccessResponseBodyType | ErrorResponseBodyType | null;
