import { EventMarketItemType } from 'src_common/common/websocket2/modelsApi/EventMarkets';
import { MobxValue } from '@twoupdigital/mobx-utils/libjs/MobxValue';

export class EventMarketsModel {
    private model: MobxValue<Array<EventMarketItemType>>;
    public constructor(model: MobxValue<Array<EventMarketItemType>>) {
        this.model = model;
    }

    public getValue(): Array<EventMarketItemType> {
        return this.model.getValue();
    }
}
