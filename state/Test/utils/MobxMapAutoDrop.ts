import { MobxMapAutoNew } from "./MobxMapAutoNew";
import { MobxValue } from "./MobxValue";

/*
const maa = new MobxMapAutoDrop((id: string, disconnect: (self: MobxValue<V>) => void): MobxValue<V> => {
    MobxValue.create({
        initValue: null,
        connect: {
            connect: () => {

            },
            dispose: (unsub, self) => {
                unsub();
                disconnect(self);
            }
        }
    })
});
*/

type FnBuildValue<K, V> = (
    key: K,
    disconnect: (self: MobxValue<V>) => void
) => MobxValue<V>;

export class MobxMapAutoDrop<K, V> {
    private readonly valueToId: Map<MobxValue<V>, K>;
    private readonly data: MobxMapAutoNew<K, MobxValue<V>>;

    constructor(buildValue: FnBuildValue<K, V>) {
        this.valueToId = new Map();
        this.data = new MobxMapAutoNew((key: K) => {
            const item = buildValue(key, this.disconnect);
            this.valueToId.set(item, key);
            return item;
        });
    }

    private disconnect = (self: MobxValue<V>): void => {
        const key = this.valueToId.get(self);

        if (key === undefined) {
            console.error('Key expected');
            return;
        }

        const tempItem = this.data.get(key);

        if (tempItem === self) {
            this.data.delete(key);
            this.valueToId.delete(self);
        } else {
            console.error(`Problems with removal ${key}`);
        }
    }

    public getItem(key: K): MobxValue<V> {
        return this.data.get(key);
    }
}
