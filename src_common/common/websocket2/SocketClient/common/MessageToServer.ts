import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { SubscriptionResourceIdIO, SubscriptionResourceIdType } from './subscriptionId';

const MessageSubscriptionsIO = t.interface({
    type: t.literal('SubscriptionValue'),
    data: t.array(t.interface({
        id: SubscriptionResourceIdIO,
        active: t.boolean
    })),
});

export type MessageSubscriptionsType = t.TypeOf<typeof MessageSubscriptionsIO>;

export const createMessageSubscriptions = (data: Array<{id: SubscriptionResourceIdType, active: boolean}>): MessageSubscriptionsType => ({
    type: 'SubscriptionValue',
    data,
});

const MessagePingIO = t.interface({
    type: t.literal('Ping')
});

type MessagePingType = t.TypeOf<typeof MessagePingIO>;

export const createMessagePong = (): MessagePingType => ({
    type: 'Ping'
});



const MessageToServerIO = t.union([
    MessageSubscriptionsIO, MessagePingIO
]);

export type MessageToServerType = t.TypeOf<typeof MessageToServerIO>;

export const decodeMessageToServer = buildValidator('MessageFromClientIO', MessageToServerIO);

