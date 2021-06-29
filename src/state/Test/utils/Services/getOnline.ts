import { MobxValue } from "../MobxValue";

class ConnectWrapper {
    connect(self: MobxValue<boolean>): (() => void) {
        if (typeof window === 'undefined') {
            return () => {};
        }
    
        const onOffline = () => {
            self.setValue(false);
        };
        const onOnline = () => {
            self.setValue(true);
        };
    
        window.addEventListener('offline', onOffline);
        window.addEventListener('online', onOnline);
    
        self.setValue(navigator.onLine);
    
        return () => {
            window.removeEventListener('offline', onOffline);
            window.removeEventListener('online', onOnline);
        };
    }

    dispose(sub: (() => void)) {
        sub();
    }
}

const mobxValue = MobxValue.create({
    initValue: true,
    connect: new ConnectWrapper()
});

export const getOnline = () => {
    return mobxValue.getValue();
};
