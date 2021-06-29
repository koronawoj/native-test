import { ModelsState } from '../websocket2/ModelsState';
import { EventsCollectionList } from './EventsCollectionList';
import {
    getQueryListForSport,
    getQueryListAntePost,
    getListFromSearch,
    getQueryListInPlay,
    getQueryListUpcoming,
    getQueryListNextOffHorseracing,
    getQueryListNextOffGreyhoundracing,
    getQueryListOnLater,
    getQueryListForEventsByTemplate,
    getQueryListNextOffHorseracingWithoutFinishState,
    getQueryListForSportWithMonthRange,
} from './getQuery';
import { assertNever } from '../utils/assertNever';
import { EventsCollectionQueryType, EventsCollectionQueryFilterMarketType } from '../websocket2/modelsApi/EventsCollectionQuery';
import { ServerTimeState } from '../websocket2/ServerTimeState';
import { ConfigComponents } from '../../../config/features/config';
import { translateQuery } from './translateQuery';

const prepareId = (query: EventsCollectionQueryType): string => {
    //TODO - add sort params for deduplication query
    return JSON.stringify(query);
};

const splitToChunks = (searchText: string): [string, Array<string>] => {
    const chunks = searchText
        .split(' ')
        .map(item => item.trim())
        .filter(item => item !== '');

    const first = chunks.shift();

    if (first === undefined) {
        return ['', []];
    }

    return [first, chunks];
};

export class EventsCollectionState {
    private readonly configComponents: ConfigComponents;
    private readonly serverTime: ServerTimeState;
    private readonly modelsState: ModelsState;
    private readonly lists: Map<string, EventsCollectionList>;

    public constructor(configComponents: ConfigComponents, modelsState: ModelsState, serverTime: ServerTimeState) {
        this.configComponents = configComponents;
        this.serverTime = serverTime;
        this.modelsState = modelsState;

        this.lists = new Map();
    }

    public get = (queryIn: EventsCollectionQueryType): EventsCollectionList => {

        const id = prepareId(queryIn);

        const list = this.lists.get(id);

        if (list !== undefined) {
            return list;
        }

        const query = translateQuery(this.configComponents, queryIn);

        const newList = new EventsCollectionList(
            this.serverTime,
            this.modelsState,
            () => this.modelsState.getEventQuery(query),
        );

        this.lists.set(id, newList);
        return newList;
    }

    public get listInPlay(): EventsCollectionList {
        return this.get(getQueryListInPlay());
    }

    public get listUpcoming(): EventsCollectionList {
        return this.get(getQueryListUpcoming());
    }

    public get listNextOffHorseracing(): EventsCollectionList {
        return this.get(getQueryListNextOffHorseracing());
    }

    public get listNextOffGreyhoundracing(): EventsCollectionList {
        return this.get(getQueryListNextOffGreyhoundracing());
    }

    public getRaces(type: 'horseracing' | 'greyhoundracing'): EventsCollectionList {
        if (type === 'horseracing') {
            return this.listNextOffHorseracing;
        }

        if (type === 'greyhoundracing') {
            return this.listNextOffGreyhoundracing;
        }

        return assertNever('getRace', type);
    }

    public get listNextOffHorseracingWithoutFinishState(): EventsCollectionList {
        return this
            .get(getQueryListNextOffHorseracingWithoutFinishState())
            .filterBySportAndEvent((_sport: string, event): boolean => event.timeline !== 'Finished');
    }

    public get listOnLater(): EventsCollectionList {
        return this.get(getQueryListOnLater());
    }

    public listOfSport(sport: string, filterMarket?: EventsCollectionQueryFilterMarketType): EventsCollectionList {
        if (sport === 'horseracing' || sport === 'greyhoundracing') {
            return this.getRaces(sport);
        }

        return this.get(getQueryListForSport(sport, filterMarket));
    }

    public listOfSportWithMonthRange(sport: string, filterMarket?: EventsCollectionQueryFilterMarketType): EventsCollectionList {
        return this.get(getQueryListForSportWithMonthRange(sport, filterMarket));
    }

    public listOfEventsByTemplate(templateId: string): EventsCollectionList {
        return this.get(getQueryListForEventsByTemplate(templateId));
    }

    public listOfSportAndCompetition(sport: string, competition: number): EventsCollectionList {
        return this.listOfSport(sport)
            .filterByCompetition((competitionId: number): boolean => competitionId === competition);
    }

    public listAntePostRacing(sport: 'horseracing' | 'greyhoundracing'): EventsCollectionList {
        return this.get(getQueryListAntePost(sport));
    }

    public listOfSearch(searchText: string): EventsCollectionList {
        const [searchTextFirst, chunks] = splitToChunks(searchText.toLocaleLowerCase());

        const list = this
            .get(getListFromSearch(searchTextFirst))
            .filterBySportAndEvent((_sport: string, event): boolean => {
                for (const chunkItem of chunks) {
                    if (event.name.toLocaleLowerCase().includes(chunkItem) === false) {
                        return false;
                    }
                }

                return true;
            });

        return list;
    }

    public listInPlayOrFilteredUpcoming(): EventsCollectionList {
        if (this.listInPlay.isEmpty === true) {
            return this.listUpcoming
                .filterBySportAndEvent((sport, event) => {
                    if (sport === 'football' || sport === 'tennis' || sport === 'basketball') {
                        return this.serverTime.fromNowToNext24h.matchMs(event.startTime);
                    } else {
                        return this.serverTime.fromNowToNextWeek.matchMs(event.startTime);
                    }
                })
                .limit(25)
            ;
        }

        return this.listInPlay;
    }
}
