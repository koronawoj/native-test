
import * as t from 'io-ts';
import { buildValidator } from 'src/state/Test/utils/buildValidator';

const WebsocketV1ResponseSuccessIO = t.interface({
    status: t.literal('ok')
});

export const decodeResponseSuccess = buildValidator('WebsocketV1ResponseSuccessIO', WebsocketV1ResponseSuccessIO);

