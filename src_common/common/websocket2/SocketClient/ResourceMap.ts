import { SubscriptionResourceIdType } from './common/subscriptionId';

interface ResourceMapParamsType<K, V> {
    createResourceId: (key: K) => SubscriptionResourceIdType,
    onCreate: (key: K) => V,
}

export type ItemType<K, V> = {
    key: K,
    value: V
}

export interface VBase<K> {
    isObserved() : boolean,
    getKey: () => K
}

export class ResourceMap<K, V extends VBase<K>> {
    private readonly params: ResourceMapParamsType<K, V>;
    private data: Map<string, ItemType<K, V>> = new Map();

    constructor(params: ResourceMapParamsType<K, V>) {
        this.params = params;
    }

    getOrCreate(key: K): V {
        const keyString = JSON.stringify(key);
        const item = this.data.get(keyString);

        if (item !== undefined) {
            return item.value;
        }

        const newValue = this.params.onCreate(key);

        this.data.set(keyString, {
            key,
            value: newValue
        });

        return newValue;
    }

    get size(): number {
        return this.data.size;
    }

    isObserved(): boolean {
        for (const item of this.data.values()) {
            if (item.value.isObserved()) {
                return true;
            }
        }

        return false;
    }

    activeEntries(): Array<SubscriptionResourceIdType> {
        const out = [];

        for (const item of this.data.values()) {
            if (item.value.isObserved()) {
                out.push(this.params.createResourceId(item.key));
            }
        }

        return out;
    }
}
