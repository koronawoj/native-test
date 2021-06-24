import { createResultLoading, createResultReady, Result } from "../../utils/Result";
import { MobxValue } from "../../utils/MobxValue";

type DecodeFn<T> = (data: unknown) => T | Error;

export class RemoteValueContext<RawModel, Model> {
    private readonly decode: DecodeFn<RawModel>;
    private readonly createModel: (model: MobxValue<RawModel>) => Model;

    constructor(decode: DecodeFn<RawModel>, createModel: (model: MobxValue<RawModel>) => Model) {
        this.decode = decode;
        this.createModel = createModel;
    }

    onMessage(valueToDecode: unknown): Result<RawModel> {
        const decodeValue = this.decode(valueToDecode);

        if (decodeValue instanceof Error) {
            console.error(decodeValue);
            return createResultLoading();
        }

        return createResultReady(decodeValue);
    }

    create(model: MobxValue<RawModel>): Model {
        return this.createModel(model);
    }
}
