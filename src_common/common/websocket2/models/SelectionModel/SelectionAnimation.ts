import { MobxValue } from "@twoupdigital/mobx-utils/libjs/MobxValue";

class SelectionAnimationFrame {
    priceChange: MobxValue<null | 'up' | 'down'> = MobxValue.create({
        initValue: null
    });

    constructor(starting: 'up' | 'down', timeout: number) {
        this.priceChange.setValue(starting);

        setTimeout(() => {
            this.priceChange.setValue(null);
        }, timeout);
    }
}

export class SelectionAnimation {
    readonly timeout: number;
    animation: MobxValue<SelectionAnimationFrame | null>;

    constructor(timeout: number) {
        this.timeout = timeout;
        this.animation = MobxValue.create({
            initValue: null
        });
    }

    startAnimation(direction: 'up' | 'down'): void {
        this.animation.setValue(new SelectionAnimationFrame(direction, this.timeout));
    }

    get priceChange(): null | 'up' | 'down' {
        const animation = this.animation.getValue();
    
        if (animation !== null) {
            return animation.priceChange.getValue();
        }

        return null;
    }
}
