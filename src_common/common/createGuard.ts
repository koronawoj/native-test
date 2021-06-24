import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';

export const createGuard = <A>(decoder: t.Type<A, A, unknown>): ((data: unknown) => data is A) => {
    return (data: unknown): data is A => {
        const decodeResult = decoder.decode(data);
        return isRight(decodeResult);
    };
};


export const createGuardExact = <A>(decoder: t.Type<A, A, unknown>): ((data: unknown) => data is A) => {
    return (data: unknown): data is A => {
        const decodeResult = decoder.decode(data);
        if (isRight(decodeResult)) {
            if (JSON.stringify(decodeResult.right) === JSON.stringify(data)) {
                return true;
            }

            //https://github.com/gcanti/io-ts/issues/322#issuecomment-584658211
        }

        return false;
    };
};
