import { CompetitionModelType } from '../modelsApi/Competition';
import { MobxValue } from '../../utils/MobxValue';

export class CompetitionModel {
    private readonly model: MobxValue<CompetitionModelType>;

    public constructor(model: MobxValue<CompetitionModelType>) {
        this.model = model;
    }

    public getData(): CompetitionModelType {
        return this.model.getValue();
    }

    public getRawData(): CompetitionModelType {
        return this.getData();
    }

    public get id(): number {
        return this.getData().id;
    }

    public get displayOrder(): number {
        return this.getData().displayOrder;
    }

    public get name(): string {
        return this.getData().name;
    }
}
