import { getSocket, SocketDataType } from './WebsocketV1getSocket';
import { SocketIOCache } from './socket_io';
import { timeout } from 'src/state/Test/utils/timeout';

type CallbackNoargsType = () => void;
type CallbackArgsType = (data: unknown) => void;

type CallbackItemType = {
    type: 'noargs',
    callback: CallbackNoargsType,
} | {
    type: 'args',
    callback: CallbackArgsType,
}

const getCallbackList = (subscribeMap: Map<string, Array<CallbackItemType>>, id: string): Array<CallbackItemType> => {
    const list = subscribeMap.get(id);
    if (list !== undefined) {
        return list;
    }
    const newList: Array<CallbackItemType> = [];
    subscribeMap.set(id, newList);
    return newList;
};

const removeCallback = (subscribeMap: Map<string, Array<CallbackItemType>>, id: string, callback: CallbackNoargsType | CallbackArgsType): void => {
    const callbacks = getCallbackList(subscribeMap, id).filter((item) => {
        return item.callback !== callback;
    });

    if (callbacks.length === 0) {
        subscribeMap.delete(id);
    } else {
        subscribeMap.set(id, callbacks);
    }
};

export class WebsocketV1 {
    private socketCache: SocketIOCache;
    private readonly websocket_host: string;
    private socketData: SocketDataType | null = null;
    private isInit: boolean = false;
    private subscribeMap: Map<string, Array<CallbackItemType>>;

    public constructor(websocket_host: string) {
        this.socketCache = new SocketIOCache();
        this.websocket_host = websocket_host;
        this.subscribeMap = new Map();
    }

    private init(): void {
        if (this.isInit) {
            return;
        }
        this.isInit = true;
        console.info('WebsocketV1 - start');

        setTimeout(async () => {
            while (true) {
                console.info('WebsocketV1 - connection starting');

                const createSocket = await this.socketCache.getByHost(this.websocket_host);

                try {
                    const socketData = await getSocket(createSocket);
                    this.socketData = socketData;

                    console.info('WebsocketV1 - connection started');

                    for (const [id, callbackList] of this.subscribeMap.entries()) {
                        for (const callbackItem of callbackList) {                            
                            if (callbackItem.type === 'noargs') {
                                console.info(`WebsocketV1 - Refresh on subscribe for ${id}`);
                                callbackItem.callback();
                            }

                            socketData.subscribe(id, callbackItem.callback);
                        }
                    }

                    await socketData.isClose;
                }
                catch (error) {
                    console.error('WebsocketV1 - error connection', error);
                }

                await timeout(3000);
            }
        }, 0);
    }

    public subscribe(id: string, callback: CallbackNoargsType): void {
        this.init();

        getCallbackList(this.subscribeMap, id).push({
            type: 'noargs',
            callback: callback
        });

        if (this.socketData !== null) {
            this.socketData.subscribe(id, callback);
        }
    }

    /**
     * @deprecated - use the function subscribe
     */
    public subscribeOldVersionToDelete(id: string, callback: CallbackArgsType): void {
        this.init();

        getCallbackList(this.subscribeMap, id).push({
            type: 'args',
            callback: callback
        });

        if (this.socketData !== null) {
            this.socketData.subscribe(id, callback);
        }
    }

    public unsubscribe(id: string, callback: CallbackNoargsType | CallbackArgsType): void {
        removeCallback(this.subscribeMap, id, callback);

        if (this.socketData !== null) {
            this.socketData.unsubscribe(id, callback);
        }
    }

    public emit(id: string, data: unknown): void {
        if (this.socketData !== null) {
            this.socketData.emit(id, data);
        }
    }
}

/*
$appState.websocketV1.subscribe('138040:Wallet', (data) => {
    console.info('z socketa - callback1', data);
});
$appState.websocketV1.subscribe('138040:Wallet', (data) => {
    console.info('z socketa - callback2', data);
});
$appState.websocketV1.subscribe('138040:Wallet', (data) => {
    console.info('z socketa - callback3', data);
});
*/

// socket.subscribe(id + ':Chat', response => resolve(response.body));
// socket.subscribe(id + ':Chat', response => resolve(response.body));

