import { fetchPost } from '@twoupdigital/realtime-server/libjs/fetch';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { SuccessPlaceBetResponseTypeIO, SuccessPlaceBetResponseType } from './postPlaceBetTypes';

const ResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.interface({
            bets: t.array(SuccessPlaceBetResponseTypeIO),
        }),
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({})
    })
]);

const decodeResponse = buildValidator('postAcceptOffer -> ResponseIO', ResponseIO, true);

interface ResponseType {
    status: 'success',
    data: Array<SuccessPlaceBetResponseType>
}

export const postAcceptOffer = async (): Promise<ResponseType | null> => {
    const response = await fetchPost({
        url: `/api/betslip/offered-betslip/accept`,
        decode: decodeResponse,
        body: {}
    });

    if (response.status === 200) {
        return {
            status: 'success',
            data: response.bodyJson.bets
        };
    }

    return null;
};
