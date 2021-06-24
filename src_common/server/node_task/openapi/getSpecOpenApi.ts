import * as t from 'io-ts';
// eslint-disable-next-line import/no-relative-parent-imports
import { createGuardExact } from '../../../common/createGuard';
import { OpenApiType, setRequired, getType } from './openApiType';

export const MethodIO = t.union([
    t.literal('get'),
    t.literal('post'),
    t.literal('delete'),
    t.literal('put'),
    t.literal('patch'),
]);

export type OpenApiMethodType = t.TypeOf<typeof MethodIO>;

const allMethods: Array<OpenApiMethodType> = ['get', 'post', 'delete', 'put', 'patch'];


const isPathsType = createGuardExact(t.interface({
    paths: t.record(t.string, t.unknown)
}));

const isPathsMethod = createGuardExact(t.interface({
    get: t.unknown,
    post: t.unknown,
    delete: t.unknown,
    put: t.unknown,
    patch: t.unknown
}));


const isPathsMethodDef = createGuardExact(t.interface({
    operationId: t.union([t.string, t.undefined]),
    parameters: t.union([t.undefined, t.array(t.interface({
        in: t.union([t.literal('path'), t.literal('body'), t.literal('query'), t.literal('header')]),
        name: t.string,
        required: t.union([t.boolean, t.undefined]),
    }))]),
    responses: t.record(t.string, t.unknown),
    requestBody: t.union([t.void, t.interface({
        required: t.union([t.void, t.boolean])
    })]),
    security: t.unknown,
}));

interface ParametersType {
    in: 'path' | 'body' | 'query' | 'header',
    name: string,
    type: OpenApiType
}
export interface SpecHandlerType {
    responses: Map<number, OpenApiType>,
    parameters: Array<ParametersType>,
}

const createFromRequestBody = (type: OpenApiType): ParametersType => ({
    in: 'body',
    name: 'requestBody',
    type
});

export interface SpecOpenApi {
    paths: Map<string, Map<OpenApiMethodType, SpecHandlerType>>;
}

const parseHttpCode = (data: string): number => {
    const dataNum = parseInt(data, 10);
    if (isNaN(dataNum)) {
        throw Error('The http response code was expected');
    }
    return dataNum;
};


const getSpecForMethod = (methodBody: unknown, allSpec: unknown): SpecHandlerType | null => {
    if (methodBody === undefined) {
        return null;
    }

    if (!isPathsMethodDef(methodBody)) {
        console.info('methodBody', methodBody);
        throw Error('error decode in getSpecForMethod');
    }

    const responses: Map<number, OpenApiType> = new Map();
    const parameters = [];

    for (const param of methodBody.parameters ?? []) {
        const { in: inparam, name, required, ...restParams } = param;
        parameters.push({
            in: inparam,
            name: name,
            type: setRequired(getType(restParams, allSpec), param.required ?? false),
        });
    }

    if (methodBody.requestBody !== undefined) {
        const { required, ...methodBodyRest } = methodBody.requestBody;
        const requiredValue = required === true ? true : false;
        const type = setRequired(getType(methodBodyRest, allSpec), requiredValue);
        parameters.push(createFromRequestBody(type));
    }

    for (const [code, body] of Object.entries(methodBody.responses)) {
        const codeNum = parseHttpCode(code);
        responses.set(codeNum, getType(body, allSpec));
    }

    return {
        responses,
        parameters,
    };
};


const getSpecPath = (pathBody: unknown, allSpec: unknown): Map<OpenApiMethodType, SpecHandlerType> => {
    if (!isPathsMethod(pathBody)) {
        throw Error('incorrect isPathsMethod');
    }

    const result: Map<OpenApiMethodType, SpecHandlerType> = new Map();

    for (const methodAction of allMethods) {
        const methodBody = getSpecForMethod(pathBody[methodAction], allSpec);

        if (methodBody !== null) {
            result.set(methodAction, methodBody);
        }
    }

    return result;
};

export const getSpecOpenApi = (rawSpec: unknown): SpecOpenApi => {

    const allSpec = rawSpec;

    if (!isPathsType(rawSpec)) {
        throw Error('Brakuje path');
    }

    const result = new Map();

    for (const [path, pathBody] of Object.entries(rawSpec.paths)) {
        result.set(path, getSpecPath(pathBody, allSpec));
    }

    return {
        paths: result,
    };
};
