import * as t from 'io-ts';
import { MethodIO, OpenApiMethodType, SpecHandlerType } from './getSpecOpenApi';
import { SpecSource } from './getSpecSource';

type MethodType = t.TypeOf<typeof MethodIO>;

export interface SpecMethod {
    url: string,
    method: MethodType,
}

const fixUrl = (url: string, paramFrom: string, paramTo: string): string | null => {
    const newUrl = url
        .split('/')
        .map((item) => {
            if (item === paramFrom) {
                return `{${paramTo}}`;
            }

            return item;
        })
        .join('/');

    if (newUrl !== url) {
        return newUrl;
    }

    return null;
};

const correctHandler = (handler: SpecHandlerType, paramTo: string): SpecHandlerType => {
    handler.parameters.push({
        in: 'path',
        name: paramTo,
        type: {
            type: 'string',
            required: true,
        }
    });

    return handler;
};

const correctHandlers = (
    handlers: Map<OpenApiMethodType, SpecHandlerType>,
    paramTo: string
): Map<OpenApiMethodType, SpecHandlerType> => {

    const out = new Map();

    for (const [method, handler] of handlers.entries()) {
        out.set(method, correctHandler(handler, paramTo));
    }

    return out;
};

const correcSpecOpenApi = (
    paths: Map<string, Map<OpenApiMethodType, SpecHandlerType>>,
    paramFrom: string,
    paramTo: string
): Map<string, Map<OpenApiMethodType, SpecHandlerType>> => {

    const out = new Map();

    for (const [path, body] of paths.entries()) {
        const newPath = fixUrl(path, paramFrom, paramTo);
        const newBody = newPath === null ? body : correctHandlers(body, paramTo);
        out.set(newPath ?? path, newBody);
    }

    return out;
};


const correctSpecMethods = (methods: Record<string, SpecMethod>, paramFrom: string, paramTo: string): void => {
    for (const specMethof of Object.values(methods)) {
        const newUrl = fixUrl(specMethof.url, paramFrom, paramTo);

        if (newUrl !== null) {
            specMethof.url = newUrl;
        }
    }
};

export const fixUrlParam = (spec: SpecSource, paramFrom: string, paramTo: string): void => {
    spec.spec.paths = correcSpecOpenApi(spec.spec.paths, paramFrom, paramTo);
    correctSpecMethods(spec.methods, paramFrom, paramTo);
    
};
