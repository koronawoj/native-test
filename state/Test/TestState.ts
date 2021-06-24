import { action, computed, observable } from 'mobx';
import { ModelsState } from './websocket2/ModelsState';
import { ModelsStateSocketConfig } from './websocket2/ModelsStateSocketConfig';
import { ServerTimeState } from './websocket2/ServerTimeState';
import { EventsCollectionState } from './EventsCollection/EventsCollectionState';
import { EventsCollectionList } from './EventsCollection/EventsCollectionList';
import { ConfigComponents, ConfigMainType } from './config/features/config';
import { makeAutoObservable } from "mobx"

export class TestState {

    activeSport: string = 'football';

    public readonly models: ModelsState;
    public readonly eventsCollection: EventsCollectionState;
    public readonly configComponents: ConfigComponents;
    public readonly serverTime: ServerTimeState;

    constructor() {
        makeAutoObservable(this);
        this.configComponents = new ConfigComponents('star');
        this.serverTime = new ServerTimeState();

        const modelsStateSocketConfig = new ModelsStateSocketConfig({
            apiEventListIncludes: (): Record<string, string[]> => ({
                "horseracing": ['internationalhorseracing', 'horseracingantepost'],
                "greyhoundracing": ['internationalgreyhoundracing'],
            }),
            oddsFormatShort: (): 'f' | 'd' | 'a' => 'f',
            selectionViewPriceFixed: (): boolean => false,
        });

        this.models = new ModelsState(
            true,
            modelsStateSocketConfig,
            "wss://socket-star.stg.sherbetcloud.com/ws",
        );

        this.eventsCollection = new EventsCollectionState(
            this.configComponents,
            this.models,
            this.serverTime
        );
    }

    get test(): any {
        return this.models.getEvent(102151);
    }

    get eventsList(): EventsCollectionList {
        return this.eventsCollection.listOfSport(this.activeSport);
    }

    get listEventName(): Array<{id: number, name: string}> {
        return this.eventsList.events.map(elem => {
            return {
                id: elem.id,
                name: elem.name
            }
        })
    }

    onChangeSport = (id: string) => {
        this.activeSport = id;
    }

    get activeSportForView(): string {
        return SPORTS_LIST.find(elem => elem.id === this.activeSport)?.name ?? '';
    }
}




export const SPORTS_LIST = [
    {
      "id": "americanfootball",
      "name": "American Football"
    },
    {
      "id": "australianrules",
      "name": "Australian Rules"
    },
    {
      "id": "badminton",
      "name": "Badminton"
    },
    {
      "id": "baseball",
      "name": "Baseball"
    },
    {
      "id": "basketball",
      "name": "Basketball"
    },
    {
      "id": "boxing",
      "name": "Boxing"
    },
    {
      "id": "cricket",
      "name": "Cricket"
    },
    {
      "id": "cycling",
      "name": "Cycling"
    },
    {
      "id": "darts",
      "name": "Darts"
    },
    {
      "id": "esports",
      "name": "Esports"
    },
    {
      "id": "football",
      "name": "Football"
    },
    {
      "id": "formulaone",
      "name": "Formula One"
    },
    {
      "id": "gaelicfootball",
      "name": "Gaelic Football"
    },
    {
      "id": "gaelichurling",
      "name": "Gaelic Hurling"
    },
    {
      "id": "golf",
      "name": "Golf"
    },
    {
      "id": "greyhoundracing",
      "name": "Greyhound Racing"
    },
    {
      "id": "handball",
      "name": "Handball"
    },
    {
      "id": "horseracing",
      "name": "Horse Racing"
    },
    {
      "id": "horseracingantepost",
      "name": "Horse Racing AntePost"
    },
    {
      "id": "icehockey",
      "name": "Ice Hockey"
    },
    {
      "id": "internationalgreyhoundracing",
      "name": "International Greyhound Racing"
    },
    {
      "id": "internationalhorseracing",
      "name": "International Horse Racing"
    },
    {
      "id": "mixedmartialarts",
      "name": "Mixed Martial Arts"
    },
    {
      "id": "motorsport",
      "name": "Motor Sport"
    },
    {
      "id": "olympics",
      "name": "Olympics"
    },
    {
      "id": "politics",
      "name": "Politics"
    },
    {
      "id": "rugbyleague",
      "name": "Rugby League"
    },
    {
      "id": "rugbyunion",
      "name": "Rugby Union"
    },
    {
      "id": "snooker",
      "name": "Snooker"
    },
    {
      "id": "tabletennis",
      "name": "Table Tennis"
    },
    {
      "id": "tennis",
      "name": "Tennis"
    },
    {
      "id": "tennisdoubles",
      "name": "Tennis Doubles"
    },
    {
      "id": "tvspecials",
      "name": "Other"
    },
    {
      "id": "volleyball",
      "name": "Volleyball"
    }
  ]