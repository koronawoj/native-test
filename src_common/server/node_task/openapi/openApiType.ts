import * as t from 'io-ts';
// eslint-disable-next-line import/no-relative-parent-imports
import { assertNever } from '../../../common/assertNever';
// eslint-disable-next-line import/no-relative-parent-imports
import { createGuard, createGuardExact } from '../../../common/createGuard';

const SHOW_LOG = false;
const showLog = (message: string): void => {
    if (SHOW_LOG) {
        console.info(message);
    }
};

export type OpenApiType = {
    type: 'string',
    required: boolean,
} | {
    type: 'number',
    required: boolean,
} | {
    type: 'boolean',
    required: boolean,
} | {
    type: 'array',
    items: OpenApiType,
    required: boolean,
} | {
    type: 'object',
    props: Record<string, OpenApiType>,
    required: boolean,
} | {
    type: 'record',
    value: OpenApiType,
    required: boolean,
} | {
    type: 'unknown',
};

export const setRequired = (type: OpenApiType, required: boolean): OpenApiType => {
    if (type.type === 'string') {
        return {
            type: 'string',
            required,
        };
    }

    if (type.type === 'number') {
        return {
            type: 'number',
            required,
        };
    }

    if (type.type === 'boolean') {
        return {
            type: 'boolean',
            required,
        };
    }

    if (type.type === 'array') {
        return {
            type: 'array',
            items: type.items,
            required,
        };
    }

    if (type.type === 'object') {
        return {
            type: 'object',
            props: type.props,
            required,
        };
    }

    if (type.type === 'record') {
        return {
            type: 'record',
            value: type.value,
            required,
        };
    }

    if (type.type === 'unknown') {
        return type;
    }

    return assertNever('setRequired', type);
};

const isRecord = createGuardExact(t.record(t.string, t.unknown));

const isTypeUnknown = createGuardExact(t.strict({
    description: t.string,
}));

const isTypeString = createGuardExact(t.strict({
    type: t.literal('string'),
    format: t.union([t.undefined, t.string]),
    enum: t.union([t.undefined, t.array(t.string)]),                //TODO - to be handled
    description: t.unknown,
}));

const isTypeInteger = createGuardExact(t.strict({
    type: t.literal('integer'),
    format: t.union([t.undefined, t.string]),
    description: t.union([t.string, t.undefined]),
}));

const isTypeNumber = createGuardExact(t.strict({
    type: t.literal('number'),
    format: t.union([t.undefined, t.string]),
}));

const isTypeBoolean = createGuardExact(t.strict({
    type: t.literal('boolean'),
    format: t.union([t.undefined, t.string]),
    description: t.union([t.string, t.undefined]),
}));

const isTypeWithSchema = createGuardExact(t.strict({
    description: t.union([t.string, t.undefined]),
    schema: t.interface({}),
}));

const isTypeContent = createGuardExact(t.strict({
    description: t.union([t.string, t.undefined]),
    headers: t.unknown,
    content: t.strict({
        '*/*': t.strict({
            schema: t.unknown,
        })
    })
}));

const isTypeTextPlain = createGuardExact(t.strict({
    description: t.union([t.string, t.undefined]),
    headers: t.unknown,
    content: t.strict({
        'text/plain': t.strict({
            schema: t.unknown,
        })
    })
}));

const isTypeContentJson = createGuardExact(t.strict({
    description: t.union([t.string, t.undefined]),
    headers: t.unknown,
    content: t.strict({
        'application/json': t.strict({
            schema: t.unknown,
        })
    })
}));

const isTypeContentOctetStream = createGuardExact(t.strict({
    description: t.union([t.string, t.undefined]),
    headers: t.unknown,
    content: t.strict({
        'application/octet-stream': t.strict({
            schema: t.unknown,
        })
    })
}));

const isTypeArray = createGuard(t.strict({
    type: t.literal('array'),
    items: t.unknown,
}));

const isTypeRef = createGuardExact(t.strict({
    '$ref': t.string,
}));

const isTypeStruct = createGuardExact(t.strict({
    type: t.literal('object'),
    properties: t.record(t.string, t.unknown),
    required: t.union([t.array(t.string), t.undefined]),
    description: t.union([t.string, t.undefined]),
}));

const isOneOf = createGuardExact(t.strict({
    oneOf: t.array(t.unknown),
    discriminator: t.union([t.record(t.string, t.unknown), t.undefined]),
}));

const isTypeStructAdditionalProperties = createGuardExact(t.strict({
    type: t.literal('object'),
    additionalProperties: t.unknown,
}));

const isTypeStructUnknown = createGuardExact(t.strict({
    type: t.literal('object'),
}));

const followRef = (ref: string, allSpec: unknown): unknown => {
    const refChunks = ref.split('/');

    const first = refChunks.shift();
    if (first !== '#') {
        throw Error(`The ref was expected to start with # --> ${ref}`);
    }

    let currentWsk = allSpec;

    for (const nextRefChunk of refChunks) {
        if (isRecord(currentWsk)) {
            currentWsk = currentWsk[nextRefChunk];

            if (typeof currentWsk === 'undefined') {
                throw Error(`Ref error: ${ref}`);
            }
        } else {
            throw Error(`it is impossible to follow ${nextRefChunk} (full $ref={ref})`);
        }
    }

    return currentWsk;
};

export const getType = (data: unknown, allSpec: unknown): OpenApiType => {
    if (isTypeUnknown(data)) {
        showLog('Discover isTypeUnknown');

        return {
            type: 'unknown',
        };
    }

    if (isTypeString(data)) {
        showLog('Discover isTypeString');

        return {
            type: 'string',
            required: true,
        };
    }

    if (isTypeInteger(data) || isTypeNumber(data)) {
        showLog('Discover isTypeInteger');

        return {
            type: 'number',
            required: true,
        };
    }

    if (isTypeBoolean(data)) {
        showLog('Discover isTypeBoolean');

        return {
            type: 'boolean',
            required: true,
        };
    }

    if (isTypeWithSchema(data)) {
        showLog('Discover isTypeWithSchema');

        return getType(data.schema, allSpec);
    }

    if (isTypeContent(data)) {
        showLog('Discover isTypeContent');

        return getType(data.content['*/*'].schema, allSpec);
    }

    if (isTypeTextPlain(data)) {
        showLog('Discover isTypeTextPlain');

        return getType(data.content['text/plain'].schema, allSpec);
    }

    if (isTypeContentJson(data)) {
        showLog('Discover isTypeContentJson');

        return getType(data.content['application/json'].schema, allSpec);
    }

    if (isTypeContentOctetStream(data)) {
        showLog('Discover isTypeContentOctetStream');

        return getType(data.content['application/octet-stream'].schema, allSpec);
    }

    if (isTypeArray(data)) {
        showLog('Discover isTypeArray');

        return {
            type: 'array',
            items: getType(data.items, allSpec),
            required: true,
        };
    }

    if (isTypeRef(data)) {
        showLog('Discover isTypeRef');

        const newData = followRef(data.$ref, allSpec);
        return getType(newData, allSpec);
    }

    if (isTypeStructUnknown(data)) {
        showLog('Discover UnknownStructIO');

        return {
            type: 'record',
            value: {
                type: 'unknown',
            },
            required: true,
        };
    }

    if (isTypeStructAdditionalProperties(data)) {
        showLog('Discover isAdditionalProperties');

        return {
            type: 'record',
            value: getType(data.additionalProperties, allSpec),
            required: true,
        };
    }

    if (isTypeStruct(data)) {
        showLog('Discover isTypeStruct');

        const properties: Record<string, OpenApiType> = {};

        for (const [name, value] of Object.entries(data.properties)) {
            const isRequired = (data.required ?? []).includes(name);
            properties[name] = setRequired(getType(value, allSpec), isRequired);
        }

        return {
            type: 'object',
            props: properties,
            required: true,
        };
    }

    if (isOneOf(data)) {
        const first = data.oneOf[0];

        if (data.oneOf.length > 1) {
            throw Error('TODO - add support for multiple  oneOf');
        }

        if (data.oneOf.length === 0) {
            throw Error('oneOf - At least one value was expected');
        }

        return getType(first, allSpec);
    }

    if (isRecord(data) && Object.keys(data).length === 0) {
        showLog('Discover RecordIO');

        return {
            type: 'unknown',
        };
    }

    console.info('Type unrecognised', data);
    throw Error('TODO');
};
