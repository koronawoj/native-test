import { IComputedValue, computed } from "mobx";

export class LazyComputed<T> {
    private innerComputed: null | IComputedValue<T>;

    constructor(private readonly fn: () => T, private readonly equals?: (a: T, b: T) => boolean) {
        this.innerComputed = null;
    }

    get(): T {
        if (this.innerComputed === null) {
            if (this.equals === undefined) {
                this.innerComputed = computed(this.fn);
            } else {
                this.innerComputed = computed(this.fn, { equals: this.equals});
            }
        }

        return this.innerComputed.get();
    }

    static create<T>(fn: () => T, equals?: (a: T, b: T) => boolean): LazyComputed<T> {
        return new LazyComputed(fn, equals);
    }
}

export const compareArrays = <T>(a: Array<T>, b: Array<T>): boolean => {
    if (a.length !== b.length) {
        return false;
    }

    const max = a.length;

    for (let i=0; i<max; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
};
