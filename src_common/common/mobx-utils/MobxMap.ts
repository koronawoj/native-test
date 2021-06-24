import { Resource } from './Resource';

export class MobxMap<K extends unknown[] | string | number, V> {
    private data: Map<string, Resource<V>>;

    public constructor(private readonly getValue: (id: K) => Promise<V>) {
        this.data = new Map();
    }

    public get(id: K): Resource<V> {
        const idString = JSON.stringify(id);
        const item = this.data.get(idString);

        if (item !== undefined) {
            return item;
        }

        const newItem = new Resource(
            async (): Promise<V> => this.getValue(id)
        );

        this.data.set(idString, newItem);
        return newItem;
    }
}
