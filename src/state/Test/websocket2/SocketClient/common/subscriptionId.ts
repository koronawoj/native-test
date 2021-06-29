import * as t from 'io-ts';
import { EventsCollectionQueryType } from '../../modelsApi/EventsCollectionQuery';
import { assertNever } from '../../../utils/assertNever';
import { RabMarketIO } from '../../modelsApi/RabMarket';

export const SubscriptionResourceIdIO = t.union([
    t.interface({
        type: t.literal('ModelSport'),
        id: t.string,
    }),
    t.interface({
        type: t.literal('ModelCompetition'),
        id: t.number,
    }),

    t.interface({
        type: t.literal('ModelMarket'),
        id: t.number,
    }),

    t.interface({
        type: t.literal('ModelEvent'),
        id: t.number,
    }),

    t.interface({
        type: t.literal('ModelEventMarkets'),
        id: t.number,
    }),
 
    t.interface({
        type: t.literal('QueryEvents'),
        query: t.string,
    }),

    t.interface({
        type: t.literal('ModelRabMarkets'),
        platformId: t.string,
    }),
]);

export type SubscriptionResourceIdType = t.TypeOf<typeof SubscriptionResourceIdIO>;

export const createSubscriptionModelSport = (sport: string): SubscriptionResourceIdType => ({
    type: 'ModelSport',
    id: sport
});

export const createSubscriptionModelCompetition = (competition: number): SubscriptionResourceIdType => ({
    type: 'ModelCompetition',
    id: competition
});

export const createSubscriptionModelMarket = (market: number): SubscriptionResourceIdType => ({
    type: 'ModelMarket',
    id: market
});

export const createSubscriptionModelEvent = (eventId: number): SubscriptionResourceIdType => ({
    type: 'ModelEvent',
    id: eventId
});

export const createSubscriptionModelEventMarkets = (eventId: number): SubscriptionResourceIdType => ({
    type: 'ModelEventMarkets',
    id: eventId
});

export const createSubscriptionQueryEvents = (query: EventsCollectionQueryType): SubscriptionResourceIdType => ({
    type: 'QueryEvents',
    query: JSON.stringify(query)
});

export const createSubscriptionModelRabMarkets = (platformId: string): SubscriptionResourceIdType => ({
    type: 'ModelRabMarkets',
    platformId
});

export const SubscriptionResourceUpdateIO = t.union([
    t.interface({
        type: t.literal('ModelSport'),
        id: t.string,
        data: t.unknown,
    }),
    t.interface({
        type: t.literal('ModelCompetition'),
        id: t.number,
        data: t.unknown,
    }),
    t.interface({
        type: t.literal('ModelMarket'),
        id: t.number,
        data: t.unknown,
    }),
    t.interface({
        type: t.literal('ModelEvent'),
        id: t.number,
        event: t.unknown,
    }),
    t.interface({
        type: t.literal('ModelEventMarkets'),
        id: t.number,
        data: t.unknown,
    }),
    t.interface({
        type: t.literal('QueryEvents'),
        query: t.string,
        data: t.interface({
            group: t.unknown,
            query: t.string,
        }),
    }),
    t.interface({
        type: t.literal('ModelRabMarkets'),
        platformId: t.string,
        rabMarkets: t.array(RabMarketIO)
    })
]);

export type SubscriptionResourceUpdateType = t.TypeOf<typeof SubscriptionResourceUpdateIO>;


export const convertSubscriptionResourceUpdateToId = (data: SubscriptionResourceUpdateType): SubscriptionResourceIdType => {

    if (data.type === 'ModelSport') {
        return {
            type: 'ModelSport',
            id: data.id
        };
    }

    if (data.type === 'ModelCompetition') {
        return {
            type: 'ModelCompetition',
            id: data.id
        };
    }

    if (data.type === 'ModelMarket') {
        return {
            type: 'ModelMarket',
            id: data.id
        };
    }

    if (data.type === 'ModelEvent') {
        return {
            type: 'ModelEvent',
            id: data.id
        };
    }

    if (data.type === 'ModelEventMarkets') {
        return {
            type: 'ModelEventMarkets',
            id: data.id
        };
    }

    if (data.type === 'QueryEvents') {
        return {
            type: 'QueryEvents',
            query: data.query
        };
    }

    if (data.type === 'ModelRabMarkets') {
        return {
            type: 'ModelRabMarkets',
            platformId: data.platformId,
        };
    }

    assertNever('convertSubscriptionResourceUpdateToId', data);
};
