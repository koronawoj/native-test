interface OptionsParamsType<T> {
    onChangesInSubscriptions?: (self: EventEmmiter<T>) => void
}

export class EventEmmiter<T> {
    private events: Set<(param: T) => void> = new Set();

    private readonly options?: OptionsParamsType<T>;

    constructor(options?: OptionsParamsType<T>) {
        this.options = options;
    }

    private triggerChangeChangesInSubscriptions() {
        this.options?.onChangesInSubscriptions?.(this);
    }

    on(callback: (param: T) => void) {
        let isActive = true;

        const onExec = (param: T) => {
            if (isActive) {
                callback(param);
            }
        };

        this.events.add(onExec);
        this.triggerChangeChangesInSubscriptions();

        return () => {
            isActive = false;
            this.events.delete(onExec);
            this.triggerChangeChangesInSubscriptions();
        };
    }

    trigger(param: T) {
        const eventsCopy = Array.from(this.events.values())

        for (const itemCallbackToRun of eventsCopy) {
            try {
                itemCallbackToRun(param);
            } catch (err) {
                console.error(err);
            }
        }
    }

    get size(): number {
        return this.events.size;
    }
}