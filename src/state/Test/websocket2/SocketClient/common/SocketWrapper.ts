import { MessageToBrowserType } from './MessageToBrowser';
import { MessageToServerType } from './MessageToServer';

export interface ProcessMessageParamType {
    done: () => void,
    processMessage: (data: string) => void
}

export type ProcessMessageFnType = (processMessageParam: ProcessMessageParamType) => void;

export interface SenderType {
    processMessage: (data: string) => void,
}

interface CreateResultType {
    sender: SenderType,
    socket: SocketWrapper
}

interface ParamsType {
    readonly decoder: (data: unknown) => MessageToBrowserType | Error,
    readonly send: (message: string) => void,
    readonly rawSocket: WebSocket,
    timeMs: number,
    callback: (socket: SocketWrapper, message: Array<MessageToBrowserType>) => void,
    onPong: () => void,
}

export class SocketWrapper {
    private readonly params: ParamsType;
    private buffer: Array<MessageToBrowserType>;
    private timer: NodeJS.Timeout | null;

    constructor(params: ParamsType) {
        this.params = params;
        this.buffer = [];
        this.timer = null;
    }

    static create(params: ParamsType): CreateResultType {
        const socket = new SocketWrapper(params);
        const sender = {
            processMessage: socket.processMessage
        };

        return {
            sender,
            socket
        };
    }

    private processMessage = (data: string): void => {
        const dataObject = JSON.parse(data);
        const message = this.params.decoder(dataObject);

        if (message instanceof Error) {
            console.error(message);
            return;
        }

        if (message.type === 'Pong') {
            this.params.onPong();
            return;
        }

        this.buffer.push(message);

        if (this.timer === null) {
            this.timer = setTimeout(this.sendMessagesToClient, this.params.timeMs);
        }
    }

    private sendMessagesToClient = (): void => {
        this.timer = null;
        const buffer = this.buffer;
        this.buffer = [];
        this.params.callback(this, buffer);
    }

    send(message: MessageToServerType): number {
        const messageString = JSON.stringify(message);
        this.params.send(messageString);
        return messageString.length;
    }

    get rawSocket(): WebSocket {
        return this.params.rawSocket;
    }
}
