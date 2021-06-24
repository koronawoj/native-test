import * as t from 'io-ts';
import * as path from 'path';
// eslint-disable-next-line import/no-relative-parent-imports
import { readFile } from '../../stdfs';
// eslint-disable-next-line import/no-relative-parent-imports
import { fetchGeneral } from '../../../common/fetch';
// eslint-disable-next-line import/no-relative-parent-imports
import { assertNever } from '../../../common/assertNever';
import { getSpecOpenApi, MethodIO, SpecOpenApi } from './getSpecOpenApi';
// eslint-disable-next-line import/no-relative-parent-imports
import { createGuardExact } from '../../../common/createGuard';
import { fixUrlParam } from './fixUrlParam';

type MethodType = t.TypeOf<typeof MethodIO>;

export interface SpecMethod {
    url: string,
    method: MethodType,
}

interface UrlFixType {
    from: string,
    to: string,
}

export interface SpecSource {
    spec: SpecOpenApi,
    methods: Record<string, SpecMethod>,
}

const isSpec = createGuardExact(t.interface({
    source: t.union([
        t.interface({
            type: t.literal('url'),
            url: t.string,
            fix_url_param: t.union([t.undefined, t.array(t.interface({
                from: t.string,
                to: t.string,
            }))])
        }),
        t.interface({
            type: t.literal('file'),
            file: t.string,
            fix_url_param: t.union([t.undefined, t.array(t.interface({
                from: t.string,
                to: t.string,
            }))])
        })
    ]),
    methods: t.record(t.string, t.interface({
        url: t.string,
        method: MethodIO,
    }))
}));


export const getSpecSourceInner = async (api_url: string, specDir: string, specPath: string): Promise<[SpecSource, Array<UrlFixType>]> => {
    const data = JSON.parse(await readFile(specPath));

    if (!isSpec(data)) {
        throw Error('Incorrect specification format');
    }

    if (data.source.type === 'url') {
        const specUrl = `${api_url}${data.source.url}`;

        const response = await fetchGeneral('GET', {
            url: specUrl,
            timeout: 'default',
        });

        if (response.status === 200) {
            if (response.body.type === 'json') {
                const result = {
                    spec: getSpecOpenApi(response.body.json),
                    methods: data.methods,
                };

                return [result, data.source.fix_url_param ?? []];
            } else {
                throw Error('The Json was expected');
            }
        }

        throw Error('Responses were expected with a status of 200');
    }

    if (data.source.type === 'file') {
        const specPath = path.join(specDir, data.source.file);

        const result = {
            spec: getSpecOpenApi(JSON.parse(await readFile(specPath))),
            methods: data.methods,
        };

        return [result, data.source.fix_url_param ?? []];
    }

    return assertNever('', data.source);
};

export const getSpecSource = async (api_url: string, specDir: string, specPath: string): Promise<SpecSource> => {
    const [spec, fix_url_param] = await getSpecSourceInner(api_url, specDir, specPath);

    for (const fix_url_item of fix_url_param) {
        fixUrlParam(spec, fix_url_item.from, fix_url_item.to);
    }

    return spec;
};
