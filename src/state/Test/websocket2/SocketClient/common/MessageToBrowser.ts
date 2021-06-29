import * as t from 'io-ts';
import { buildValidator } from '../../../utils/buildValidator';
import { SubscriptionResourceUpdateIO, SubscriptionResourceUpdateType } from './subscriptionId';


// const MessageHearbeatIO = t.interface({
//     type: t.literal('Hearbeat'),
//     value: t.number,
//     serverTimeInMs: t.number,
// });

//type MessageHearbeatType = t.TypeOf<typeof MessageHearbeatIO>;

// export const createMessageHearbeat = (value: number, serverTimeInMs: number): MessageHearbeatType => ({
//     type: 'Hearbeat',
//     value: value,
//     serverTimeInMs: serverTimeInMs
// });

const MessagePongIO = t.interface({
    type: t.literal('Pong')
});

type MessagePongType = t.TypeOf<typeof MessagePongIO>;

export const createMessagePong = (): MessagePongType => ({
    type: 'Pong'
});

const MessageUpdateIO = t.interface({
    type: t.literal('Update'),
    item: SubscriptionResourceUpdateIO
});

export type MessageUpdateType = t.TypeOf<typeof MessageUpdateIO>;

export const createMessageUpdate = (item: SubscriptionResourceUpdateType): MessageUpdateType => ({
    type: 'Update',
    item,
});

const MessageMessageIO = t.interface({
    type: t.literal('Message'),
    text: t.string
});


const MessageToBrowserIO = t.union([
//    MessageHearbeatIO,
    MessagePongIO,
    MessageUpdateIO,
    MessageMessageIO,
]);

export type MessageToBrowserType = t.TypeOf<typeof MessageToBrowserIO>;

export const decodeMessageToBrowser = buildValidator('MessageToBrowserIO', MessageToBrowserIO, true);



