import { SocketWrapper } from './common/SocketWrapper';
import { MessageToBrowserType, decodeMessageToBrowser } from './common/MessageToBrowser';
import { PromiseBoxRace } from '@twoupdigital/mobx-utils/libjs/PromiseBox';

type BrowserSocketType = SocketWrapper;

const getCurrentTimeInSec = (): number => Math.floor(new Date().getTime() / 1000);

export interface ConnectionResult {
    socket: BrowserSocketType,
    done: Promise<void>,
}

export const createSocketWrapper = async (
    host: string,
    timeMs: number,
    callback: (socket: SocketWrapper, message: Array<MessageToBrowserType>
) => void): Promise<ConnectionResult | null> => {


    let pingTime: number | null = null;
    let pongTime: number | null = null;

    let timerPing: NodeJS.Timer | null = null;
    let timerPingCheck: NodeJS.Timer | null = null;


    console.info('Websocket - create socket');

    const socket = new WebSocket(host);

    const socketWrapper = SocketWrapper.create({
        decoder: decodeMessageToBrowser,
        send: (message: string) => {
            socket.send(message);
        },
        rawSocket: socket,
        timeMs,
        callback,
        onPong: () => {
            pongTime = getCurrentTimeInSec();
        }
    });

    timerPing = setInterval(() => {
        pingTime = getCurrentTimeInSec();
        socketWrapper.socket.send({
            type: "Ping",
        });
    }, 30000);


    timerPingCheck = setInterval(() => {
        if (pingTime === null) {
            return;
        }

        if (pongTime === null) {
            const current = getCurrentTimeInSec();
            if (current - pingTime > 60) {
                console.warn(`Websocket - Pong missing, killing connection (${pingTime}, ${pongTime})`);
                socket.close();
                socketShoutDown();
            }

            return;
        }

        if (pingTime < pongTime) {
            //console.info(`Websocket - test ping ok 1 (${pingTime}, ${pongTime})`);
            //ok
            return;
        } else {
            if (pingTime - pongTime < 60) {
                //console.info(`Websocket - test ping ok 2 (${pingTime}, ${pongTime})`);
                return;
            }
        }
    
        console.warn(`Websocket - Too long response for ping, killing connection (${pingTime}, ${pongTime})`);
        socket.close();
        socketShoutDown();
    }, 10000);


    const promiseReady = new PromiseBoxRace<ConnectionResult | null>();
    const promiseEnd = new PromiseBoxRace<void>();

    const socketShoutDown = (): void => {
        if (timerPing !== null) {
            clearInterval(timerPing);
            timerPing = null;

            socket.close();
            promiseReady.resolve(null);
            promiseEnd.resolve();

            socket.onopen = (): void => {};
            socket.onclose = (): void => {};
            socket.onerror = (): void => {};
        }

        if (timerPingCheck !== null) {
            clearInterval(timerPingCheck);
            timerPingCheck = null;
        }

    };

    const onOpen = (): void => {
        console.info('Websocket - create ready');
        promiseReady.resolve({
            socket: socketWrapper.socket,
            done: promiseEnd.promise
        });
    };

    const closeConn = (): void => {
        console.info('Websocket - close');
        socketShoutDown();
    };

    const errorConn = (): void => {
        console.info('Websocket - error');
        socketShoutDown();
    };

    socket.addEventListener('open', onOpen);
    socket.onopen = onOpen;

    socket.addEventListener('close', closeConn);
    socket.onclose = closeConn;

    socket.addEventListener('error', errorConn);
    socket.onerror = errorConn;

    
    socket.addEventListener('message', (event: MessageEvent) => {
        const dataRaw = event.data;

        if (typeof dataRaw !== 'string') {
            console.error('Websocket - update error', dataRaw);
            return;
        }

        socketWrapper.sender.processMessage(dataRaw);
    });

    return promiseReady.promise;
};
