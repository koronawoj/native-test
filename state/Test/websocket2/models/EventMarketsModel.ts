import { EventMarketItemType } from '../../websocket2/modelsApi/EventMarkets';
import { MobxValue } from '../../utils/MobxValue';

export class EventMarketsModel {
    private model: MobxValue<Array<EventMarketItemType>>;
    public constructor(model: MobxValue<Array<EventMarketItemType>>) {
        this.model = model;
    }

    public getValue(): Array<EventMarketItemType> {
        return this.model.getValue();
    }
}
