// eslint-disable-next-line import/no-relative-parent-imports
import { assertNever } from '../../../common/assertNever';
import { generateIdent } from './generateIdent';
import { generateTypeTs } from './generateParamsType';
import { OpenApiMethodType, SpecHandlerType } from './getSpecOpenApi';
import { OpenApiType } from './openApiType';

const addRequire = (require: boolean, type: string): string => {
    if (require) {
        return type;
    }

    return `t.union([t.null, t.undefined, ${type}])`;
};

const generateTypeIO = (ident: number, type: OpenApiType): string => {
    const nextIdent = ident + 4;

    if (type.type === 'string') {
        return addRequire(type.required, 't.string');
    }

    if (type.type === 'number') {
        return addRequire(type.required, 't.number');
    }

    if (type.type === 'boolean') {
        return addRequire(type.required, 't.boolean');
    }
    
    if (type.type === 'unknown') {
        return addRequire(true, 't.unknown');
    }
    
    if (type.type === 'array') {
        return addRequire(type.required, `t.array(${generateTypeIO(ident, type.items)})`);
    }

    if (type.type === 'object') {
        const out = [];

        out.push('t.interface({');

        for (const [key, value] of Object.entries(type.props)) {
            out.push(`${generateIdent(nextIdent)}${key}: ${generateTypeIO(nextIdent, value)},`);
        }

        out.push(`${generateIdent(ident)}${'})'}`);

        return addRequire(type.required, out.join('\n'));
    }

    if (type.type === 'record') {
        const innerType = generateTypeIO(nextIdent, type.value);
        return addRequire(type.required, `t.record(t.string, ${innerType})`);
    }

    return assertNever('getTypeTs', type);
};

export const generateResponseIO = (spec: SpecHandlerType, url: string, method: OpenApiMethodType): string => {

    const out: Array<string> = [];

    for (const [code, response] of spec.responses.entries()) {
        out.push(`const Response${code}IO = ${generateTypeIO(0, response)};`);
        out.push('');
        out.push(`export type Response${code}Type = ${generateTypeTs(0, response)};`);
        out.push('');
        out.push(`export const decodeResponse${code} = (data: unknown): Response${code}Type => {`);
        out.push(`    const decodeResult = Response${code}IO.decode(data);`);
        out.push('    if (isRight(decodeResult)) {');
        out.push('        return decodeResult.right;');
        out.push('    }');
        out.push(`    throw Error('Response decoding error ${url} -> ${method} -> ${code}');`);
        out.push('};');
        out.push('');
        out.push('');
        out.push('');
        out.push('');
    }

    return out.join('\n');
};
