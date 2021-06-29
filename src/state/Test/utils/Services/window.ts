import { MobxValue } from "../MobxValue";

class Wrapper {
    constructor(
        readonly window: Window
    ) {}
}

class ConnectWrapper {
    connect(self: MobxValue<Wrapper | null>): (() => void) {
        if (typeof window === 'undefined') {
            self.setValue(null);
            return () => {};
        }

        self.setValue(new Wrapper(window));
    
        const onResize = () => {
            self.setValue(new Wrapper(window));
        };
    
        window.addEventListener('resize', onResize);
    
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }

    dispose(sub: (() => void)) {
        sub();
    }
}

const mobxValue: MobxValue<Wrapper | null> = MobxValue.create({
    initValue: null,
    connect: new ConnectWrapper()
});

export const getWindowInnerWidth = () => {
    const wrapper = mobxValue.getValue();
    if (wrapper === null) {
        return null;
    }

    return wrapper.window.innerWidth;
};

export const getWindowInnerHeight = () => {
    const wrapper = mobxValue.getValue();
    if (wrapper === null) {
        return null;
    }

    return wrapper.window.innerHeight;
};