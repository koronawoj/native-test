import { requirejsPromise } from './requirejs';
type CallbackType = (data: string) => void;

export interface SocketIO {
    on: (event: string, callback: CallbackType) => void,
    off: (event: string, callback: CallbackType) => void,
    io: {
        connect: () => void,
        disconnect: () => void,
    },
    emit: (eventName: string, data: unknown, callback?: (data: unknown) => void) => void,
}

const getSocketIO = (websocket_host: string): Promise<() => SocketIO> => new Promise((resolve) => {
    // tslint:disable-next-line
    if (typeof window === 'undefined') {
        return;
    }

    // requirejsPromise.then((requirejs) => {
    //     requirejs([`${websocket_host}/socket.io/socket.io.js`], (io: unknown) => {
    //         resolve(() => {
    //             //@ts-expect-error
    //             const socket = io( websocket_host, { transports: [ 'websocket', 'polling' ] } );
    //             return socket;
    //         });
    //     });
    // }).catch((error) => {
    //     console.error(error);
    // });
});

export class SocketIOCache {
    private data: Map<string, Promise<() => SocketIO>>;

    public constructor() {
        this.data = new Map();
    }

    public getByHost = (websocket_host: string): Promise<() => SocketIO> => {
        const item = this.data.get(websocket_host);

        if (item !== undefined) {
            return item;
        }

        const newItem = getSocketIO(websocket_host);
        this.data.set(websocket_host, newItem);
        return newItem;
    }
}
