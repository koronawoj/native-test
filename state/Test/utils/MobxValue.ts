import { IAtom, createAtom } from "mobx";

type OnDispose = () => void;
export type OnConnect = () => OnDispose;

interface ParamsType<T, S> {
    connect(self: MobxValue<T>): S,
    dispose(t: S, self: MobxValue<T>): void,
}

type ActionType = 'connect-try' | 'connect-finalize' | 'disconnect-try' | 'disconnect-finalize';

type StateType<S> = {
    type: 'disconnect'
} | {
    type: 'connect-progress',
    timer: NodeJS.Timeout,
} | {
    type: 'connect',
    value: S,
} | {
    type: 'disconnect-progress',
    value: S,
    timer: NodeJS.Timeout
};

class AtomWithSubscription<T, S> {
    private mobxValue: MobxValue<T>;
    private state: StateType<S>;
    private params: ParamsType<T, S>;
    private readonly atom: IAtom;

    constructor(
        mobxValue: MobxValue<T>,
        params: ParamsType<T, S>,
        readonly delayOnConnect: number | undefined,
        readonly delayOnDisconnect: number | undefined
    ) {
        this.mobxValue = mobxValue;
        this.state = {
            type: 'disconnect'
        };
        this.params = params;
        this.atom = createAtom('MobxValue', this.connect, this.dispose);
    }

    private setTimeout(delay: number, callback: () => void): NodeJS.Timeout {
        return setTimeout(callback, delay);
    }

    private action(action: ActionType) {
        if (this.state.type === 'disconnect' && action === 'connect-try') {

            const timer = this.setTimeout(this.delayOnConnect ?? 0, () => {
                this.action('connect-finalize');
            });

            this.state = {
                type: 'connect-progress',
                timer: timer
            };

            return;
        }

        if (this.state.type === 'connect-progress' && action === 'connect-finalize') {
            this.state = {
                type: 'connect',
                value: this.params.connect(this.mobxValue)
            }

            return;
        }

        if (this.state.type === 'connect' && action === 'disconnect-try') {

            const timer = this.setTimeout(this.delayOnDisconnect ?? 0, () => {
                this.action('disconnect-finalize');
            });

            this.state = {
                type: 'disconnect-progress',
                timer: timer,
                value: this.state.value
            };

            return;
        }

        if (this.state.type === 'disconnect-progress' && action === 'disconnect-finalize') {
            this.params.dispose(this.state.value, this.mobxValue);
            this.state = {
                type: 'disconnect'
            };
            return;
        }

        if (this.state.type === 'connect-progress' && action === 'disconnect-try') {
            clearTimeout(this.state.timer);
            this.state = {
                type: 'disconnect'
            };
            return;
        }

        if (this.state.type === 'disconnect-progress' && action === 'connect-try') {
            clearTimeout(this.state.timer);
            this.state = {
                type: 'connect',
                value: this.state.value
            };
            return;
        }

        console.error('Incorrect status connect');
    }

    private connect = () => {
        this.action('connect-try');
    }

    private dispose = () => {
        this.action('disconnect-try');
    }

    public reportChanged() {
        this.atom.reportChanged();
    }

    public reportObserved() {
        this.atom.reportObserved();
    }

    public get isBeingObserved() {
        return this.atom.isBeingObserved;
    }
}

export interface ConnectType<T, S> {
    connect(self: MobxValue<T>): S,
    dispose(subscription: S, self: MobxValue<T>): void,
}

interface AtomType {
    reportChanged(): void;
    reportObserved(): void;
    isBeingObserved: boolean;
}

interface MobxValueParams<T, S> {
    initValue: T,
    shouldUpdate?: (a: T, b: T) => boolean,
    connect?: ConnectType<T, S>,
    delayOnConnect?: number
    delayOnDisconnect?: number
}

export class MobxValue<T> {
    private value: T;
    private readonly atom: AtomType;
    private readonly shouldUpdate?: (a: T, b: T) => boolean;

    private constructor(params: MobxValueParams<T, unknown>) {
        this.value = params.initValue;
        this.shouldUpdate = params.shouldUpdate;

        this.atom = params.connect === undefined
            ? createAtom('MobxValue')
            : new AtomWithSubscription(
                this,
                params.connect,
                params.delayOnConnect,
                params.delayOnDisconnect
            );
    }

    static create<T, S>(params: MobxValueParams<T, S>): MobxValue<T> {
        return new MobxValue(params);
    }

    setValue(value: T) {
        if (this.shouldUpdate !== undefined && this.shouldUpdate(this.value, value) === false) {
            return;
        }

        if (this.value !== value) {
            this.value = value;
            this.atom.reportChanged();
        }
    }

    getValue(): T {
        this.atom.reportObserved();
        return this.value;
    }

    getValueSilent(): T {
        return this.value;
    }

    isObserved(): boolean {
        return this.atom.isBeingObserved;
    }
}
