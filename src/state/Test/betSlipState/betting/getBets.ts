import * as t from 'io-ts';
import { fetchGet } from '@twoupdigital/realtime-server/libjs/fetch';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { CurrencyCodeIO } from '../../redux/decode';
import endpoints from '../endpoints';
import { stringifyQS } from '../../../utils/Api';
import moment from 'moment';

const LegIO = t.interface({
    id: t.string,
    type: t.string, // "standard"
    inPlay: t.boolean,
    priceType: t.string, // "fp"
    price: t.union([
        t.null,
        t.interface({
            d: t.number,
            f: t.string,
            fractionalNumerator: t.null,
            fractionalDenominator: t.null
        })
    ]),
    spPrice: t.union([
        t.null,
        t.interface({
            d: t.number,
            f: t.string,
            fractionalNumerator: t.null,
            fractionalDenominator: t.null
        })
    ]),
    winReduction: t.null,
    placeReduction: t.null,
    result: t.union([
        t.null,
        t.interface({
            type: t.string, // "won", "lost"
            place: t.union([t.number, t.null]),
            dividends: t.union([
                t.null,
                t.interface({
                    tricast: t.array(
                        t.union([
                            t.undefined,
                            t.interface({
                                id: t.number,
                                winner: t.number,
                                '2nd': t.number,
                                '3rd': t.number,
                                dividend: t.number
                            })
                        ])
                    ),
                    forecast: t.array(
                        t.interface({
                            id: t.number,
                            winner: t.number,
                            '2nd': t.number,
                            dividend: t.number
                        })
                    )
                })
            ]),
            winReduction: t.null,
            placeReduction: t.union([
                t.null,
                t.interface({
                    num: t.number,
                    den: t.number
                })
            ]),
            r4Deductions: t.union([t.number, t.null])
        })
    ]),
    eachWayTerms: t.union([
        t.null,
        t.interface({
            places: t.number,
            reduction: t.interface({
                num: t.number,
                den: t.number
            })
        })
    ]),
    sport: t.interface({
        id: t.string,
        name: t.string
    }),
    competition: t.interface({
        id: t.number,
        name: t.string
    }),
    event: t.interface({
        id: t.number,
        name: t.string
    }),
    market: t.interface({
        id: t.number,
        name: t.string
    }),
    selection: t.interface({
        id: t.number,
        name: t.string
    })
});

const BonusIO = t.interface({
    id: t.number,
    type: t.string, // "best-odds-guaranteed"
    amount: t.number
});

const BetIO = t.interface({
    id: t.number,
    type: t.string, // SGL
    status: t.string, // "open"
    cashOut: t.boolean,
    eachWay: t.boolean,
    placedAt: t.string,
    settledAt: t.union([t.string /* Date */, t.null]),
    stakePerLine: t.number,
    totalStake: t.number,
    currency: CurrencyCodeIO,
    payout: t.union([t.number, t.null]),
    potentialReturns: t.union([t.number, t.null]),
    balanceDelta: t.null,
    comment: t.null,
    settleType: t.union([t.string /* manual */, t.null]),
    affiliate: t.null,

    transaction: t.interface({
        id: t.null,
        type: t.null,
        status: t.null,
        currency: t.null,
        amount: t.null,
        totalAmount: t.null,
        assetFlows: t.array(
            t.interface({
                id: t.number,
                date: t.string, // Date
                type: t.string, // "bet-placement"
                balanceDelta: t.number,
                balanceAfter: t.null,
                currency: CurrencyCodeIO
            })
        ),
        tags: t.interface({
            selections: t.array(t.number),
            freebetCredits: t.array(
                t.union([
                    t.undefined,
                    t.interface({
                        id: t.number,
                        amount: t.number
                    })
                ])
            ),
            bonuses: t.array(
                t.union([
                    t.undefined,
                    BonusIO
                ])
            )
        })
    }),
    numLines: t.number,
    legs: t.array(LegIO),
    tax: t.union([t.number, t.null])
});

export type BonusType = t.TypeOf<typeof BonusIO>;

export type BetType = t.TypeOf<typeof BetIO>;

export type LegType = t.TypeOf<typeof LegIO>;

const AggregationsIO = t.interface({
    total: t.union([t.undefined, t.number]),
    totalValue: t.union([t.undefined, t.number])
});

export type AggregationsType = t.TypeOf<typeof AggregationsIO>;

const ResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.interface({
            aggregations: t.union([AggregationsIO, t.undefined]),
            results: t.array(BetIO)
        })
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.unknown
    })
]);

const decodeResponse = buildValidator('getBets -> ResponseIO', ResponseIO, true);

export type ResponseType =
    | {
          success: false;
      }
    | {
          success: true;
          value: Array<BetType>
      };

export interface GetBetsTypes {
    startDate: Date | null;
    endDate: Date | null;
    perPage?: number;
    status: string;
}

interface QueryType {
    perPage: number;
    sort: string;
    status?: string;
    placedAt?: {
        gte?: string;
        lte?: string;
    };
    'transaction.type'?: string;
}

export const getBets = async ({ status, startDate, endDate, perPage = 250 }: GetBetsTypes): Promise<ResponseType> => {
    const query: QueryType = {
        perPage,
        sort: '-placedAt'
    };

    if (status !== 'all') {
        query.status = status;
    }

    if (startDate) {
        query.placedAt = {
            gte: `${moment(startDate).format('YYYY-MM-DD')}T00:00:00`
        };
    }

    if (endDate) {
        query.placedAt = {
            ...query.placedAt,
            lte: `${moment(endDate).format('YYYY-MM-DD')}T23:59:59`
        };
    }

    const response = await fetchGet({
        url: `${endpoints.betting.get.bets}?${stringifyQS(query)}`,
        decode: decodeResponse
    });

    if (response.status === 200) {
        return {
            success: true,
            value: response.bodyJson.results
        };
    }

    return {
        success: false
    };
};
