import { MobxValue } from '../../utils/MobxValue';
import { RabMarketType } from '../modelsApi/RabMarket';

export class RabMarketsModel {
    private readonly model: MobxValue<Array<RabMarketType>>;

    public constructor(model: MobxValue<Array<RabMarketType>>) {
        this.model = model;
    }

    public get markets(): Array<RabMarketType> {
        return this.model.getValue();
    }
}
