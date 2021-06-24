import moment from 'moment';
import { EventsCollectionQueryType, EventsCollectionQueryFilterMarketType } from '../websocket2/modelsApi/EventsCollectionQuery';

export type SportType = 'horseracing' | 'greyhoundracing';

export const getQueryListInPlay = (): EventsCollectionQueryType => ({
    state: 'open',
    'market.display': true,
    'timeSettings.tradedInPlay': 'true',
    sport: { ne: ['horseracing', 'greyhoundracing'] },
    time: 'in-play',
});

export const getQueryListUpcoming = (): EventsCollectionQueryType => ({
    state: 'open',
    'market.display': true,
    'timeSettings.tradedInPlay': undefined,
    sport: { ne: ['horseracing', 'greyhoundracing'] },
    time: 'upcoming',
});

export const getQueryListEventsCarousel = (): EventsCollectionQueryType => ({
    'market.display': true,
    state: 'open'
});

export const getQueryListNextOffHorseracing = (): EventsCollectionQueryType => ({
    sport: 'horseracing',
    started: false,
    time: 'next-off',
    'market.display': true,
    state: 'open',
    filterRaces: true,
});

export const getQueryListNextOffHorseracingWithoutFinishState = (): EventsCollectionQueryType => ({
    sport: 'horseracing',
    time: 'next-off',
    'market.display': true,
    state: 'open',
    filterRaces: true,
});

export const getQueryListNextOffGreyhoundracing = (): EventsCollectionQueryType => ({
    sport: 'greyhoundracing',
    started: false,
    time: 'next-off',
    'market.display': true,
    // 'tags.star-events': '-',
    state: 'open',
    filterRaces: true,
});

export const getQueryListOnLater = (): EventsCollectionQueryType => ({
    time: 'upcoming',
    'market.display': true,
    state: 'open',
    'tags.star-events': {
        from: 1,
        to: 99
    },
    sort: 'star-events'
});

export const getQueryListForSport = (sport: string, filterMarket?: EventsCollectionQueryFilterMarketType): EventsCollectionQueryType => ({
    'market.display': true,
    state: 'open',
    sport: sport,
    filterMarket
});

export const getQueryListForSportWithMonthRange = (
    sport: string,
    filterMarket?: EventsCollectionQueryFilterMarketType
): EventsCollectionQueryType => {
    const from = moment().subtract('month').startOf('day');
    const to = moment().add(1, 'month').startOf('day');

    return {
        'market.display': true,
        state: 'open',
        sport: sport,
        filterMarket,
        'startTime[from]': from.toISOString(),
        'startTime[to]': to.toISOString(),
    };
};

export const getQueryListForEventsByTemplate = (templateId: string): EventsCollectionQueryType => ({
    'market.display': true,
    state: 'open',
    filterMarket: {
        templateId
    }
});

export const getQueryListAntePost = (sport: string): EventsCollectionQueryType => {
    const today = moment().startOf('day');

    return ({
        'state': 'open',
        'market.display': true,
        'market.ante-post': 'yes',
        'startTime[from]': today.toISOString(),
        sport,
    });
};

export const getListFromSearch = (searchText:string): EventsCollectionQueryType => ({
    'market.display': true,
    q: searchText,
    state: 'open',
    time: 'search-time'
});

