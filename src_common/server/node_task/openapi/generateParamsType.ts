// eslint-disable-next-line import/no-relative-parent-imports
import { assertNever } from '../../../common/assertNever';
import { fixToCamelCase } from './fixToCamelCase';
import { generateIdent } from './generateIdent';
import { SpecHandlerType } from './getSpecOpenApi';
import { OpenApiType } from './openApiType';

const addRequire = (require: boolean, type: string): string => {
    if (require) {
        return type;
    }

    return `null | undefined | ${type}`;
};

export const generateTypeTs = (ident: number, type: OpenApiType): string => {
    const nextIdent = ident + 4;

    if (type.type === 'string') {
        return addRequire(type.required, 'string');
    }

    if (type.type === 'number') {
        return addRequire(type.required, 'number');
    }

    if (type.type === 'boolean') {
        return addRequire(type.required, 'boolean');
    }
    if (type.type === 'unknown') {
        return addRequire(true, 'unknown');
    }
    if (type.type === 'array') {
        return addRequire(type.required, `Array<${generateTypeTs(ident, type.items)}>`);
    }

    if (type.type === 'object') {
        const out = [];

        out.push(addRequire(type.required, '{'));

        for (const [key, value] of Object.entries(type.props)) {
            out.push(`${generateIdent(nextIdent)}${key}: ${generateTypeTs(nextIdent, value)},`);
        }

        out.push(`${generateIdent(ident)}${'}'}`);

        return out.join('\n');
    }

    if (type.type === 'record') {
        const innerType = generateTypeTs(nextIdent, type.value);
        return addRequire(type.required, `Record<string, ${innerType}>`);
    }

    return assertNever('getTypeTs', type);
};

export const generateParamsType = (spec: SpecHandlerType): string => {
    const out: Array<string> = ['export interface ParamsType {'];

    for (const param of spec.parameters) {
        if (param.in === 'body' || param.in === 'path' || param.in === 'query') {
            out.push(`${generateIdent(4)}${fixToCamelCase(param.name)}: ${generateTypeTs(4, param.type)},`);
        } else if (param.in === 'header') {
            //nothing
        } else {
            assertNever('param.in', param.in);
        }
    }

    out.push('}');

    return out.join('\n');
};
