import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

const EventMarketItemIO = t.interface({
    id: t.number,
    templateId: t.string,
    websiteMain: t.boolean,
    keyLine: t.union([t.number, t.null, t.undefined]),
    createdAt: t.number,
    displayOrder: t.number,
    eventId: t.number,
    name: t.string,
    displayTemplate: t.union([t.string, t.null, t.undefined]),
    groupTemplate: t.union([t.string, t.null, t.undefined]),
    templateName: t.string,
});

const EventMarketsIO = t.array(EventMarketItemIO);

export const decodeEventMarkets = buildValidator('decodeEventMarkets', EventMarketsIO);

export type EventMarketItemType = t.TypeOf<typeof EventMarketItemIO>;

// export interface EventMarketItemType {
//     id: number,
//     templateId: string,
//     websiteMain: boolean,
//     raceWinner: boolean,
//     antePost: boolean
// }
