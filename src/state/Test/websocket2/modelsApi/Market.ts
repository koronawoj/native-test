import * as t from 'io-ts';
import { buildValidator } from '../../utils/buildValidator';

//http://10.110.0.32:8080/operator-events/${universe}/16935/markets/1522764
//http://10.110.0.32:8080/operator-markets/iyisans/1522764

const SelectionApiModelFieldTagsIO = t.union([t.record(t.string, t.array(t.string)), t.undefined]);
export type SelectionApiModelFieldTagsType = t.TypeOf<typeof SelectionApiModelFieldTagsIO>;


const PriceIO = t.interface({
    d: t.number,
    f: t.string,
    empty: t.undefined,                                 //TODO - should be always undefined
});

export type PriceType = t.TypeOf<typeof PriceIO>;

const TemplateIO = t.interface({
    id: t.string,
    marketTemplateId: t.string
});

export type TemplateType = t.TypeOf<typeof TemplateIO>;

const PriceHistoryItemIO = t.interface({
    t: t.string,
    p: t.interface({
        d: t.number,
        f: t.string
    })
});


export type PriceHistoryItemType = t.TypeOf<typeof PriceHistoryItemIO>;

const SelectionApiModelIO = t.interface({
    id: t.number,
    uuid: t.union([ t.string, t.undefined, t.null ]),
    display: t.union([t.boolean, t.undefined]),
    tags: t.record(t.string, t.string),
    price: t.union([PriceIO, t.undefined, t.null]),
    template: t.union([TemplateIO, t.undefined]),
    displayOrder: t.union([t.number, t.undefined]),
    active: t.union([t.boolean, t.undefined, t.null]),
    name: t.union([t.string, t.undefined]),
    state: t.union([t.string, t.undefined]),
    result: t.union([
        t.interface({
            type: t.union([t.string, t.undefined, t.null]),
        }),
        t.undefined,
        t.null
    ]),
    priceHistory: t.union([
        t.undefined,
        t.null,
        t.array(PriceHistoryItemIO)]
    ),
});

export type SelectionApiModelType = t.TypeOf<typeof SelectionApiModelIO>;

export type SelectionModelType = SelectionApiModelType & {
    eventId: number,
    marketId: number
}


const MarketTemplateModelTypeIO = t.interface({
    id: t.string,
    name: t.string,
});

export type MarketTemplateModelType = t.TypeOf<typeof MarketTemplateModelTypeIO>;

const TermsModelTypeIO = t.interface({
    places: t.number,
    reduction: t.string
});

export type TermsModelType = t.TypeOf<typeof TermsModelTypeIO>;

const EachWayIO = t.interface({
    offered: t.boolean,
    terms: t.array(TermsModelTypeIO),
    termsWithBet: t.boolean,
});

export type EachWayType = t.TypeOf<typeof EachWayIO>;


const MarketApiModelIO = t.interface({
    id: t.number,
    uuid: t.union([ t.string, t.undefined, t.null ]),
    event: t.interface({
        id: t.number,
    }),
    selections: t.record(t.string, SelectionApiModelIO),
    //updatedAt: t.string,
    updated: t.interface({
        updatedAt: t.string,
    }),
    display: t.union([t.boolean, t.undefined]),
    template: MarketTemplateModelTypeIO,
    tags: t.record(t.string, t.string),
    line: t.union([t.number, t.null, t.undefined]),
    eachWay: t.union([EachWayIO, t.undefined]),
    active: t.boolean,
    name: t.string,
    tradedInPlay: t.boolean,
    spOnly: t.boolean,
    sp: t.boolean,
    bp: t.boolean,
    displayOrder: t.number,
    tricastsOffered: t.union([t.boolean, t.undefined, t.null]),
    forecastsOffered: t.union([t.boolean, t.undefined, t.null]),
    cashoutAvailable: t.union([t.boolean, t.undefined, t.null]),
});



export type MarketApiModelType = t.TypeOf<typeof MarketApiModelIO>;

export type MarketModelType = Omit<MarketApiModelType, 'selections'> & {
    selections: Array<number>
}

export const decodeMarketResponse = buildValidator('MarketResponseIO', MarketApiModelIO);

