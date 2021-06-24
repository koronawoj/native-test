import * as t from 'io-ts';
import { createGuard } from 'src_common/common/createGuard';

const isObject = createGuard(t.record(t.string, t.unknown));

export const mergeDeep = (current: Record<string, unknown>, diff: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(current)) {
        if (diff[key] === undefined) {
            out[key] = value;
        }
    }

    for (const [key, value] of Object.entries(diff)) {
        const currentValue = current[key];

        if (isObject(value) && isObject(currentValue)) {
            out[key] = mergeDeep(currentValue, value);
        } else {
            out[key] = value;
        }
    }

    return out;
};
