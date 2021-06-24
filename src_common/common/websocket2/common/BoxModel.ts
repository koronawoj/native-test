import { Result } from '@twoupdigital/mobx-utils/libjs/Result';
import { MobxValue } from '@twoupdigital/mobx-utils/libjs/MobxValue';

type ResultModel<T> = {
    type: 'model',
    model: T,
} | {
    type: 'not-found',
} | {
    type: 'loading'
};

export interface BoxModelParamsType<Key, InputData, RawModel, Model> {
    decoder: {
        onMessage(rawData: InputData): Result<RawModel | null>,
        create(model: MobxValue<RawModel>): Model,
        afterUpdate?(model: Model): void,
    },
    key: Key,
    onConnect: (self: BoxModel<Key, InputData, RawModel, Model>) => void,
    onDisconnect: (self: BoxModel<Key, InputData, RawModel, Model>) => void
}

class ModelInit<Key, InputData, RawModel, Model> {
    private readonly params: BoxModelParamsType<Key, InputData, RawModel, Model>;
    private readonly rawModelBox: MobxValue<RawModel>;
    public readonly model: Model;

    public constructor(params: BoxModelParamsType<Key, InputData, RawModel, Model>, rawModel: RawModel) {
        this.params = params;

        this.rawModelBox = MobxValue.create({
            initValue: rawModel
        });

        this.model = this.params.decoder.create(this.rawModelBox);

        if (this.params.decoder.afterUpdate !== undefined) {
            this.params.decoder.afterUpdate(this.model);
        }
    }

    public setRawModel(rawModel: RawModel): void {
        const prevValue = this.rawModelBox.getValue();

        if (JSON.stringify(prevValue) === JSON.stringify(rawModel)) {
            return;
        }

        this.rawModelBox.setValue(rawModel);
        if (this.params.decoder.afterUpdate !== undefined) {
            this.params.decoder.afterUpdate(this.model);
        }
    }
}

export class BoxModel<Key, InputData, RawModel, Model> {
    public readonly params: BoxModelParamsType<Key, InputData, RawModel, Model>;
    public readonly boxValue: MobxValue<ResultModel<ModelInit<Key, InputData, RawModel, Model>>>;

    private constructor(
        params: BoxModelParamsType<Key, InputData, RawModel, Model>,
    ) {
        this.params = params;

        this.boxValue = MobxValue.create({
            initValue: {
                type: 'loading'
            },
            connect: this
        });
    }

    public connect(): void {
        this.params.onConnect(this);
    }

    public dispose(): void {
        this.params.onDisconnect(this);
    }

    public getKey(): Key {
        return this.params.key;
    }

    public static create<Key, InputData, RawModel, Model>(params: BoxModelParamsType<Key, InputData, RawModel, Model>): BoxModel<Key, InputData, RawModel, Model> {
        return new BoxModel(params);
    }

    public setRawData(rawData: InputData): void {
        const rawModelResult = this.params.decoder.onMessage(rawData);

        if (rawModelResult.type === 'loading') {
            return;
        }

        const rawModel = rawModelResult.value;

        if (rawModel === null) {
            this.boxValue.setValue({
                type: 'not-found',
            });
            return;
        }

        const boxValueResult = this.boxValue.getValue();

        if (boxValueResult.type === 'loading' || boxValueResult.type === 'not-found') {
            const model = new ModelInit(this.params, rawModel);
            this.boxValue.setValue({
                type: 'model',
                model: model
            });
            return;
        }

        boxValueResult.model.setRawModel(rawModel);
    }

    public getResult(): Result<Model | null> {
        const boxValue = this.boxValue.getValue();

        if (boxValue.type === 'loading') {
            return boxValue;
        }

        if (boxValue.type === 'not-found') {
            return {
                type: 'ready',
                value: null
            };
        }

        return {
            type: 'ready',
            value: boxValue.model.model,
        };
    }

    public isObserved(): boolean {
        return this.boxValue.isObserved();
    }
}
