import { SocketIO } from './socket_io';
import { decodeResponseSuccess } from './decodeResponseSuccess';
import { PromiseBox } from 'src/state/Test/utils/PromiseBox';

const CookieJwtName = 'website.sid';

export const getToken = (): string | null => {
    const cookieName = CookieJwtName;

    // tslint:disable-next-line
    if (typeof window === 'undefined') {
        return null;
    }

    const match = document.cookie.match(new RegExp(`${cookieName}=([^;]+)`));
    // eslint-disable-next-line total-functions/no-unsafe-subscript
    return match && (match[1] ?? null);
};

type CallbackType = (data: unknown) => void;
type CallbackPayloadType = (payload: string) => void;

interface CallbackManagerDriver {
    subscribe: (channel: string, shouldSubscribe: boolean, fn: CallbackPayloadType) => void,
    unsubscribe: (channel: string, shouldUnsubscribe: boolean, fn: CallbackPayloadType) => void,
}

class CallbackManager {
    private driver: CallbackManagerDriver;
    private data: Map<string, Map<CallbackType, CallbackPayloadType>>;

    public constructor(driver: CallbackManagerDriver) {
        this.driver = driver;
        this.data = new Map();
    }

    public getOrCreate(channel: string): Map<CallbackType, CallbackPayloadType> {
        const subList = this.data.get(channel);
        if (subList !== undefined) {
            return subList;
        }
        const newList = new Map();
        this.data.set(channel, newList);
        return newList;
    }

    public subscribe(channel: string, callback: CallbackType): void {
        const fn = (payload: string):void => {
            callback(JSON.parse(payload));
        };

        const subList = this.getOrCreate(channel);
        const shouldSubscribe = subList.size === 0;
        subList.set(callback, fn);

        this.driver.subscribe(channel, shouldSubscribe, fn);
    }

    public unsubscribe(channel: string, callback: CallbackType): void {
        const subList = this.getOrCreate(channel);
        const fn = subList.get(callback);

        if (fn === undefined) {
            console.error('no callback in subscription register');
            return;
        }

        subList.delete(callback);
        const shouldUnsubscribe = subList.size === 0;
        this.driver.unsubscribe(channel, shouldUnsubscribe, fn);
    }
}

export interface SocketDataType {
    token: string,
    socket: SocketIO,
    subscribe: (id: string, callback: CallbackType) => void,
    emit: (id: string, data: unknown) => void,
    unsubscribe: (id: string, callback: CallbackType) => void,
    isClose: Promise<void>,
}

export const getSocket = (createSocket: () => SocketIO): Promise<SocketDataType> => {
    return new Promise((resolve, reject) => {
        const token = getToken();

        if (token === null) {
            throw Error('WebsocketV1 - Missing token');
        }

        const socket = createSocket();

        socket.emit('auth', token, (response: unknown) => {
            const data = decodeResponseSuccess(response);
            if (data instanceof Error) {
                reject(data);
                return;
            }

            const callbacksManager = new CallbackManager({
                subscribe: (channel: string, shouldSubscribe: boolean, fn: CallbackPayloadType): void => {
                    socket.on(channel, fn);
                    if (shouldSubscribe) {
                        socket.emit('subscribe', channel);
                    }
                },
                unsubscribe: (channel: string, shouldUnsubscribe: boolean, fn: CallbackPayloadType): void => {
                    socket.off(channel, fn);
                    if (shouldUnsubscribe) {
                        socket.emit('unsubscribe', channel);
                    }
                }
            });

            const isClose = new PromiseBox<void>();

            socket.on('disconnect', () => {
                socket.io.disconnect();
                isClose.resolve();
            });

            resolve({
                token,
                socket,
                subscribe: (channel: string, callback: CallbackType) => {
                    callbacksManager.subscribe(channel, callback);
                },
                emit: (channel: string, data: unknown) => {
                    socket.emit(channel, data);
                },
                unsubscribe: (channel: string, callback: CallbackType) => {
                    callbacksManager.unsubscribe(channel, callback);
                },
                isClose: isClose.promise,
            });
        });
    });
};
