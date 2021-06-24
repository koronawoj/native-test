import { MobxValue } from '../../../utils/MobxValue';
import { SportModelType } from '../../../websocket2/modelsApi/Sport';

export class SportModel {
    private readonly model: MobxValue<SportModelType>;

    public constructor(model: MobxValue<SportModelType>) {
        this.model = model;
    }

    public getData(): SportModelType {
        return this.model.getValue();
    }

    public get id(): string {
        return this.getData().id;
    }

    public get displayOrder(): number {
        return this.getData().displayOrder;
    }

    public get name(): string {
        return this.getData().name;
    }
}
