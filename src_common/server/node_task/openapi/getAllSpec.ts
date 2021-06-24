import * as path from 'path';
// eslint-disable-next-line import/no-relative-parent-imports
import { getListFromDir } from '../../stdfs';
import { getSpecSource, SpecSource } from './getSpecSource';


const splitSpecName = (specPath: string): string | null => {
    const fileName = path.basename(specPath);

    const chunks = fileName.split('.');

    if (chunks.length !== 3) {
        return null;
    }

    const [baseName, chunk1, chunk2] = chunks;

    if (baseName !== undefined && chunk1 === 'spec' && chunk2 === 'json') {
        return baseName;
    }

    return null;
};

const getSpecList = async (specDir: string): Promise<Map<string, string>> => {
    const result = await getListFromDir(specDir);

    const out: Map<string, string> = new Map();

    for (const file of result) {
        const specName = splitSpecName(file);

        if (specName !== null) {
            out.set(specName, file);
        }
    }

    return out;
};


//TODO - do zrównoleglenia
export const getAllSpec = async (apiUrl: string, specDir: string): Promise<Map<string, SpecSource>> => {
    const specList = await getSpecList(specDir);
    const out = new Map();

    for (const [specName, specPath] of specList.entries()) {
        const spec = await getSpecSource(apiUrl, specDir, specPath);
        out.set(specName, spec);
    }

    return out;
};


export const getAllSpecOne = async (apiUrl: string, specDir: string, targetSpec: string): Promise<SpecSource> => {
    return await getSpecSource(apiUrl, specDir, `${specDir}/${targetSpec}.spec.json`);
};
