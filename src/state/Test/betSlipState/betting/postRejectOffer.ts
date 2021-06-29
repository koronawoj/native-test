import { fetchPost } from '@twoupdigital/realtime-server/libjs/fetch';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';

const ResponseIO = t.union([
    t.interface({
        status: t.literal(200),
        bodyJson: t.null,
    }),
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({})
    })
]);

const decodeResponse = buildValidator('postRejectOffer -> ResponseIO', ResponseIO, true);

interface ResponseType {
    status: 'success'
}

export const postRejectOffer = async (): Promise<ResponseType | null> => {
    const response = await fetchPost({
        url: `/api/betslip/offered-betslip/reject`,
        decode: decodeResponse,
        body: {}
    });

    if (response.status === 200) {
        return {
            status: 'success',
        };
    }

    return null;
};
