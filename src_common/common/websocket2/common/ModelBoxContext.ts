import { SelectionModel } from 'src_common/common/websocket2/models/SelectionModel/SelectionModel';
import { EventModel } from 'src_common/common/websocket2/models/EventModel';
import { MarketModel } from 'src_common/common/websocket2/models/MarketModel';
import { ServerTimeState } from 'src_common/common/websocket2/ServerTimeState';
import { EventMarketItemType } from 'src_common/common/websocket2/modelsApi/EventMarkets';
import { ModelsStateSocketConfig } from 'src_common/common/websocket2/ModelsStateSocketConfig';

export interface ModelBoxContext {
    modelsStateSocketConfig: ModelsStateSocketConfig,
    serverTime: ServerTimeState,
    getEvent: (id: number) => EventModel | null,
    getEventMarkets: (id: number) => Array<EventMarketItemType> | null,
    getMarket: (id: number) => MarketModel | null,
    getSelection: (id: number) => SelectionModel | null,
}
