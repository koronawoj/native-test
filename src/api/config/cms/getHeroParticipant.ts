import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';

import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { GetHeroParticipantType, decodeGetHeroParticipant } from './getHeroParticipantDecode';

const SuccessResponseIO = t.interface({
    status: t.literal(200),
    bodyJson: t.unknown
});

const decodeSuccessResponse = buildValidator('SuccessResponse', SuccessResponseIO);

const ErrorResponseIO = t.union([
    t.interface({
        status: t.literal(400),
        bodyJson: t.unknown
    }),
    t.interface({
        status: t.literal(404),
        bodyJson: t.unknown,
    })
]);

type ErrorResponseType = t.TypeOf<typeof ErrorResponseIO>;

type SuccessResponseType = {
    status: 200,
    bodyJson: GetHeroParticipantType
};

const decodeResponseError = buildValidator('getHeroParticipant-> ResponseIO', ErrorResponseIO, true);

const decode = (data: unknown): SuccessResponseType | ErrorResponseType | Error => {
    console.log('data',data);
    const dataSuccess = decodeSuccessResponse(data);

    if (dataSuccess instanceof Error) {
        return decodeResponseError(data);
    } else {
        return {
            status: 200,
            bodyJson: decodeGetHeroParticipant(dataSuccess.bodyJson)
        };
    }
};

export const getHeroParticipant = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/get-hero-participant'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/get-hero-participant',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        // return {
        //     passToBackend: false,
        //     status: 200,
        //     responseBody: [
        //         {
        //             "event_id": 516575,
        //             "selection_id": 119831455,
        //             "participant_id": null,
        //             "participant_color": "",
        //             "participant_name": "",
        //             "points": null,
        //             "wins": null,
        //             "race_form": "",
        //             "race_starts": null,
        //             "trainer": "4. Snoopy trainer",
        //             "form": "T1215",
        //             "top_speed": 87,
        //             "runner_number": null,
        //             "horse": "",
        //             "jockey": "",
        //             "age": null,
        //             "weight": "",
        //             "official_rating": null,
        //             "rating": null,
        //             "race_overview_position": null,
        //             "description": "",
        //             "participant_img": {
        //                 "url": "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //             },
        //         },
        //         {
        //             "event_id": 516575,
        //             "selection_id": 119831454,
        //             "participant_id": null,
        //             "participant_color": "",
        //             "participant_name": "",
        //             "points": null,
        //             "wins": null,
        //             "race_form": "",
        //             "race_starts": null,
        //             "trainer": "3. Random dog trainer",
        //             "form": "T1218",
        //             "top_speed": 91,
        //             "runner_number": null,
        //             "horse": "",
        //             "jockey": "",
        //             "age": null,
        //             "weight": "",
        //             "official_rating": null,
        //             "rating": null,
        //             "race_overview_position": null,
        //             "description": "",
        //             "participant_img": {
        //                 "url": "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //             },
        //         },
        //         {
        //             "event_id": 516575,
        //             "selection_id": 119831453,
        //             "participant_id": null,
        //             "participant_color": "",
        //             "participant_name": "",
        //             "points": null,
        //             "wins": null,
        //             "race_form": "",
        //             "race_starts": null,
        //             "trainer": "2. Doggy Dog trainer",
        //             "form": "T1217",
        //             "top_speed": 93,
        //             "runner_number": null,
        //             "horse": "",
        //             "jockey": "",
        //             "age": null,
        //             "weight": "",
        //             "official_rating": null,
        //             "rating": null,
        //             "race_overview_position": null,
        //             "description": "",
        //             "participant_img": {
        //                 "url": "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //             },
        //         },
        //         {
        //             "event_id": 516575,
        //             "selection_id": 119831452,
        //             "participant_id": null,
        //             "participant_color": "",
        //             "participant_name": "",
        //             "points": null,
        //             "wins": null,
        //             "race_form": "",
        //             "race_starts": null,
        //             "trainer": "1. Part1 trainer",
        //             "form": "T1216",
        //             "top_speed": 86,
        //             "runner_number": null,
        //             "horse": "",
        //             "jockey": "",
        //             "age": null,
        //             "weight": "",
        //             "official_rating": null,
        //             "rating": null,
        //             "race_overview_position": null,
        //             "description": "",
        //             "participant_img": {
        //                 "url": "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //             },
        //         }
        //     ]

        //     // [
        //     //     {
        //     //         event_id: 482887,
        //     //         selection_id: 114754302,
        //     //         participant_id: 461477,
        //     //         participant_color: '#fdc500',
        //     //         participant_name: 'OUTRIGHTS',
        //     //         points: 23,
        //     //         wins: 2,
        //     //         // race_form: 'test',
        //     //         // race_starts: 'test',
        //     //         trainer: 'test',
        //     //         // runner_number: 'test',
        //     //         horse: 'test',
        //     //         // jockey: 'test',
        //     //         age: 23,
        //     //         // weight: 'test',
        //     //         // official_rating: 'test',
        //     //         rating: 2,
        //     //         race_overview_position: 1,
        //     //         description: 'Description',
        //     //         participant_img: {
        //     //             url: "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //     //         },
        //     //     },
        //     //     {
        //     //         event_id: 458454,
        //     //         selection_id: 111988003,
        //     //         participant_id: 111988003,
        //     //         participant_color: '#fdc500',
        //     //         participant_name: 'horseracing',
        //     //         points: 23,
        //     //         wins: 2,
        //     //         // race_form: 'test',
        //     //         // race_starts: 'test',
        //     //         trainer: 'test',
        //     //         // runner_number: 'test',
        //     //         horse: 'test',
        //     //         // jockey: 'test',
        //     //         age: 23,
        //     //         // weight: 'test',
        //     //         // official_rating: 'test',
        //     //         rating: 2,
        //     //         race_overview_position: 1,
        //     //         description: 'Description',
        //     //         participant_img: {
        //     //             url: "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //     //         },
        //     //     },
        //     //     {
        //     //         event_id: 459214,
        //     //         selection_id: 112039806,
        //     //         participant_id: 112039806,
        //     //         participant_color: '#fdc500',
        //     //         participant_name: 'F1',
        //     //         points: 23,
        //     //         wins: 2,
        //     //         // race_form: 'test',
        //     //         // race_starts: 'test',
        //     //         trainer: 'test',
        //     //         // runner_number: 'test',
        //     //         horse: 'test',
        //     //         // jockey: 'test',
        //     //         age: 23,
        //     //         // weight: 'test',
        //     //         // official_rating: 'test',
        //     //         rating: 2,
        //     //         race_overview_position: 1,
        //     //         description: 'Description',
        //     //         participant_img: {
        //     //             url: "https://dev-cf-gpp-cms.s3.eu-central-1.amazonaws.com/images/tt/j4/ttj4tfa6x8s8/warriorstale.png"
        //     //         },
        //     //     }
        //     // ]
        // };

        return {
            url: `${params.API_URL}/cms/participantdetails/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET,
        };
    }
};
