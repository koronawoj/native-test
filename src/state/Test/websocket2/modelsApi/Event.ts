import * as t from 'io-ts';
import { buildValidator } from '../../utils/buildValidator';

//http://10.110.0.32:8080/operator-events/${universe}/16935/markets/1522764
//http://10.110.0.32:8080/operator-markets/iyisans/1522764

// const ParticipantApiModelIO = t.interface({
//     participant: t.interface({
//         id: t.string,
//         name: t.union([t.string, t.undefined, t.null]),
//     }),
//     role: t.union([t.string, t.undefined, t.null]),
//     metadata: t.union([
//         t.record(
//             t.string,
//             t.union([t.string, t.null, t.undefined])),
//         t.undefined
//     ]),
// });

// type ParticipantApiModelType = t.TypeOf<typeof ParticipantApiModelIO>;


const ParticipantModelIO = t.interface({
    id: t.number,
    name: t.union([t.string, t.undefined, t.null]),
    role: t.union([t.string, t.undefined, t.null]),
    metadata: t.union([
        t.record(
            t.string,
            t.union([t.string, t.null, t.undefined])),
        t.undefined
    ]),
});

export type ParticipantModelType = t.TypeOf<typeof ParticipantModelIO>


const TimeSettingsIO = t.interface({
    startTime: t.string,
    started: t.boolean,
    tradedInPlay: t.boolean,
    timeZone: t.string,
    timeLineState: t.union([t.string, t.undefined, t.null]),                        //TODO - to verify. This field probably does not appear.
    timeline: t.union([t.string, t.undefined, t.null]),
});

export type TimeSettingsType = t.TypeOf<typeof TimeSettingsIO>;

const feedDataIO = t.union([
    t.record(
        t.string,
        t.union([t.string, t.null])),
    t.undefined
]);

const StreamIO = t.interface({
    id: t.number,
    universe: t.string,
    eventId: t.number,
    eventName: t.string,
    provider: t.string,
    streamId: t.number,
    geoRuleType: t.union([t.literal('DENY'), t.literal('ALLOW')]),
    geoRuleCountries: t.string,
    live: t.boolean,
});

export type StreamType = t.TypeOf<typeof StreamIO>;

const EventBasicModelIO = t.interface({
    sport: t.string,
});

export type EventBasicModelType = t.TypeOf<typeof EventBasicModelIO>;

export const decodeEventBasicModel = buildValidator('EventBasicModelIO', EventBasicModelIO, true);

const EventModelIO = t.interface({
    id: t.number,
    uuid: t.union([ t.string, t.undefined, t.null ]),
    sport: t.string,
    sportOriginal: t.string,
    competition: t.number,
    template: t.string,
    updated: t.interface({
        updatedAt: t.string,
    }),
    participants: t.record(t.string, ParticipantModelIO),
    timeSettings: TimeSettingsIO,
    tags: t.record(t.string, t.union([
        t.undefined,
        t.string
    ])),
    feedData: feedDataIO,
    active: t.boolean,
    display: t.boolean,
    state: t.string,
    name: t.string,
    antePost: t.boolean,
    statistics: t.record(t.string, t.union([
        t.undefined,
        t.record(t.string, t.union([
            t.undefined,
            t.string
        ]))
    ])),
    stream: t.union([
        t.array(StreamIO),
        t.undefined,
        t.null
    ]),
    platformObject: t.union([
        t.interface({
            id: t.union([t.string, t.null, t.undefined]),
        }),
        t.null,
        t.undefined
    ])
});

export const decodeEventModel = buildValidator('EventModelIO', EventModelIO, true);



export type EventModelType = t.TypeOf<typeof EventModelIO>;

/*
    "participants": [
        {
            "participant": {
                "id": "2317",
                "name": "Nk Lokomotiva Zagreb",
                "url": "http://10.110.0.32:8080/operator-participants/iyisans/2317",
                "externalId": {
                    "instance": "iyisans",
                    "provider": "spin",
                    "feedId": "a4ad9df7-8e8d-4b86-89d3-9b01a415332d"
                }
            },
            "role": "home",
            "metadata": {}
        },
        {
            "participant": {
                "id": "2318",
                "name": "Dinamo Zagreb",
                "url": "http://10.110.0.32:8080/operator-participants/iyisans/2318",
                "externalId": {
                    "instance": "iyisans",
                    "provider": "spin",
                    "feedId": "6026b1ea-2e16-49e7-aebc-14800d830b22"
                }
            },
            "role": "away",
            "metadata": {}
        }
    ],
*/
