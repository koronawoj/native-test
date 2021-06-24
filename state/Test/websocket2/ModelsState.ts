// import { ModelsState } from '../websocket2/ModelsStateSocket';
// export { ModelsState };

import { EventModel } from '../websocket2/models/EventModel';
import { MarketModel } from '../websocket2/models/MarketModel';
import { SelectionModel } from '../websocket2/models/SelectionModel/SelectionModel';
import { SportModel } from '../websocket2/models/SportModel/SportModel';
import { ModelsEventState } from '../websocket2/ModelsEventState';
import { CompetitionModel } from '../websocket2/models/CompetitionModel';
import { EventsCollectionQueryType } from '../websocket2/modelsApi/EventsCollectionQuery';
import { EventMarketItemType } from '../websocket2/modelsApi/EventMarkets';
import { EventsCollectionQueryModel } from '../websocket2/models/EventsCollectionQueryModel';
import { RabMarketsModel } from '../websocket2/models/RabMarketsModel';
import { ModelsStateSocketConfig } from './ModelsStateSocketConfig';

export class ModelsState {
    private readonly modelsEvent: ModelsEventState;

    public constructor(
        isBrowser: boolean,
        modelsStateSocketConfig: ModelsStateSocketConfig,
        websocket_host_v2: string,
    ) {
        this.modelsEvent = new ModelsEventState(isBrowser, modelsStateSocketConfig, websocket_host_v2);
    }

    public get allEventsId(): Array<number> {
        return this.modelsEvent.allEventsId;
    }

    public getSport(sportId: string): SportModel | null {
        return this.modelsEvent.getSport(sportId);
    }

    /**
     * @deprecated
     */
    public getSelection = (id: number): SelectionModel | null => {
        return this.modelsEvent.getSelection(id);
    }

    public getSelectionAndLoad = (marketId: number, selectionId: number): SelectionModel | null => {
        return this.modelsEvent.getSelectionAndLoad(marketId, selectionId);
    }

    public getMarketWithLoading = (id: number): MarketModel | null | 'loading' => {
        return this.modelsEvent.getMarketWithLoading(id);
    }

    public getMarket = (id: number): MarketModel | null => {
        return this.modelsEvent.getMarket(id);
    }

    public getEvent = (id: number): EventModel | null => {
        return this.modelsEvent.getEvent(id);
    }

    public getEventMarkets = (id: number): Array<EventMarketItemType> | null => {
        return this.modelsEvent.getEventMarkets(id);
    }

    public getEventIsLoading(id:number): boolean {
        return this.modelsEvent.getEventIsLoading(id);
    }

    public getEventStatusLoading(id:number): 'PROGRESS' | 'READY' | 'ERROR' {
        if (this.getEventIsLoading(id)) {
            return 'PROGRESS';
        }
        return 'READY';
    }

    public getCompetitionModel(id: number): CompetitionModel | null {
        return this.modelsEvent.getCompetitionModel(id);
    }

    public getEventQuery(query: EventsCollectionQueryType): EventsCollectionQueryModel | null {
        return this.modelsEvent.getEventQuery(query);
    }

    public getRabMarkets(platformId: string): RabMarketsModel | null {
        return this.modelsEvent.getRabMarkets(platformId);
    }

    public getPlatformIdByEventId(eventId: number): string | null {
        const event = this.getEvent(eventId);
        if (event === null) {
            return null;
        }

        const feedId = event.feedId ?? null;

        if (feedId === null) {
            return null;
        }
        
        return `01_${feedId}`;
    }

    public getRabMarketsByEventId(eventId: number): RabMarketsModel | null {
        const platformId = this.getPlatformIdByEventId(eventId);

        if (platformId !== null) {
            return this.getRabMarkets(platformId);
        }

        return null;
    }

    public debugEvent(id: number): void {
        const event = this.getEvent(id)?.getData();
        const eventMarkets = this.getEventMarkets(id) ?? [];

        const markets = eventMarkets.map((item) => {
            const market = this.getMarket(item.id)?.getData();
            const selections = [];

            if (market !== undefined) {
                for (const selectionId of market.selections) {
                    const selection = this.getSelection(selectionId)?.getData();
                    if (selection !== undefined) {
                        selections.push(selection);
                    }
                }
            }

            return {
                market,
                selections
            };
        });

        console.info({
            event,
            eventMarkets,
            markets
        });
    }
}
