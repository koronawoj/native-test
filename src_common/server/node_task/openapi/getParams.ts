import * as path from 'path';

const getBaseDir = (): string => {
    const self_path = process.argv[1];

    if (self_path === undefined) {
        throw Error('self_path error');
    }

    const self_dir = path.dirname(self_path);
    const openapi_dir = path.join(self_dir, '../../../../src/api_openapi');
    return openapi_dir;
};

const getApiUrl = (): string => {
    const api_url = process.argv[2];

    if (api_url === undefined) {
        throw Error('api_url error');
    }

    return api_url;
};


const getTargetSpec = (): string => {
    const api_url = process.argv[3];

    if (api_url === undefined) {
        throw Error('target spec error');
    }

    return api_url;
};

interface GetParamsReturnType {
    baseDir: string,
    apiUrl: string,
    targetSpec: string,
};

export const getParams = (): GetParamsReturnType => {
    const baseDir = getBaseDir();
    const apiUrl = getApiUrl();
    const targetSpec = getTargetSpec();

    return {
        baseDir,
        apiUrl,
        targetSpec
    };
};
