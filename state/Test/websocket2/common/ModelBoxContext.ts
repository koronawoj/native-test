import { SelectionModel } from '../../websocket2/models/SelectionModel/SelectionModel';
import { EventModel } from '../../websocket2/models/EventModel';
import { MarketModel } from '../../websocket2/models/MarketModel';
import { ServerTimeState } from '../../websocket2/ServerTimeState';
import { EventMarketItemType } from '../../websocket2/modelsApi/EventMarkets';
import { ModelsStateSocketConfig } from '../../websocket2/ModelsStateSocketConfig';

export interface ModelBoxContext {
    modelsStateSocketConfig: ModelsStateSocketConfig,
    serverTime: ServerTimeState,
    getEvent: (id: number) => EventModel | null,
    getEventMarkets: (id: number) => Array<EventMarketItemType> | null,
    getMarket: (id: number) => MarketModel | null,
    getSelection: (id: number) => SelectionModel | null,
}
