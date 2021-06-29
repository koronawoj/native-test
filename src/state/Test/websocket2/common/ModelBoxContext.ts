import { SelectionModel } from '../models/SelectionModel/SelectionModel';
import { EventModel } from '../models/EventModel';
import { MarketModel } from '../models/MarketModel';
import { ServerTimeState } from '../ServerTimeState';
import { EventMarketItemType } from '../modelsApi/EventMarkets';
import { ModelsStateSocketConfig } from '../ModelsStateSocketConfig';

export interface ModelBoxContext {
    modelsStateSocketConfig: ModelsStateSocketConfig,
    serverTime: ServerTimeState,
    getEvent: (id: number) => EventModel | null,
    getEventMarkets: (id: number) => Array<EventMarketItemType> | null,
    getMarket: (id: number) => MarketModel | null,
    getSelection: (id: number) => SelectionModel | null,
}
