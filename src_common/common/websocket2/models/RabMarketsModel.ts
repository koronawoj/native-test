import { MobxValue } from '@twoupdigital/mobx-utils/libjs/MobxValue';
import { RabMarketType } from 'src_common/common/websocket2/modelsApi/RabMarket';

export class RabMarketsModel {
    private readonly model: MobxValue<Array<RabMarketType>>;

    public constructor(model: MobxValue<Array<RabMarketType>>) {
        this.model = model;
    }

    public get markets(): Array<RabMarketType> {
        return this.model.getValue();
    }
}
