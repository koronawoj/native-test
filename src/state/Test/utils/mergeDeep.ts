
export function isObject(item: unknown): item is Record<string, unknown> {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

export function mergeDeep(current: Record<string, unknown>, diff: Record<string, unknown>): Record<string, unknown> {
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
