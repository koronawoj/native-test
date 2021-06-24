import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

const StarEventsIO = t.interface({
    from: t.number,
    to: t.number
});

export type StarEventsType = t.TypeOf<typeof StarEventsIO>;

const EventsCollectionQuerySportIO = t.union([
    t.string,
    t.array(t.string),
    t.interface({
        ne: t.array(t.string)
    }),
]);

export type EventsCollectionQuerySportType = t.TypeOf<typeof EventsCollectionQuerySportIO>;

const EventsCollectionQuerySportReplaceIO = t.array(t.interface({
    from: t.string,
    to: t.string,
}));

export type EventsCollectionQuerySportReplaceType = t.TypeOf<typeof EventsCollectionQuerySportReplaceIO>;

export const EventsCollectionQueryFilterMarketIO = t.partial({
    templateId: t.string,
    line: t.union([t.number, t.null]),
});

export type EventsCollectionQueryFilterMarketType = t.TypeOf<typeof EventsCollectionQueryFilterMarketIO>;

export const EventsCollectionQueryIO = t.partial({
    state: t.literal('open'),
    'market.display': t.literal(true),

    'market.ante-post': t.literal('yes'),
    'startTime[from]': t.string,
    'startTime[to]': t.string,

    sport: EventsCollectionQuerySportIO,
    sportReplace: EventsCollectionQuerySportReplaceIO,
    competition: t.number,
    competitionsIds: t.array(t.number),
    q: t.string,
    started: t.boolean,
    'timeSettings.tradedInPlay': t.literal('true'),
    'tags.star-events': t.union([t.string, StarEventsIO]),
    time: t.union([t.literal('in-play'), t.literal('next-off'), t.literal('upcoming'), t.literal('search-time')]),
    sort: t.union([t.literal('normal'), t.literal('star-events')]),
    filterRaces: t.literal(true),

    filterMarket: EventsCollectionQueryFilterMarketIO,
});

export type EventsCollectionQueryType = t.TypeOf<typeof EventsCollectionQueryIO>;

const EventListGroupEventItemIO = t.interface({
    id: t.number,
    name: t.string,
    tagsRegion: t.union([t.string, t.null]),
    tagsCountry: t.union([t.string, t.null]),
    tagsOutright: t.union([t.string, t.null]),
    template: t.string,
    startTime: t.number,                //ms
    timeline: t.string,
});

export type EventListGroupEventItemType = t.TypeOf<typeof EventListGroupEventItemIO>;

const EventListGroupCompetitionItemIO = t.interface({
    id: t.number,
    name: t.string,
    displayOrder: t.number,
    events: t.array(EventListGroupEventItemIO),
});

export type EventListGroupCompetitionItemType = t.TypeOf<typeof EventListGroupCompetitionItemIO>;

const EventListGroupSportItemIO = t.interface({
    id: t.string,
    name: t.string,
    displayOrder: t.number,
    competitions: t.array(EventListGroupCompetitionItemIO)
});

export type EventListGroupSportItemType = t.TypeOf<typeof EventListGroupSportItemIO>;

const EventListGroupIO = t.interface({
    sports: t.array(EventListGroupSportItemIO)
});

export type EventListGroupType = t.TypeOf<typeof EventListGroupIO>;

export const decodeEventListGroup = buildValidator('decodeEventListGroup', EventListGroupIO, true);
