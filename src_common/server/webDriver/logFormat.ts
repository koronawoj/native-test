import clc from 'cli-color';
import * as urlModule from 'url';
import { logNormalizePath } from './logNormalizePath';

const parseUrl = (url_full: string): string | undefined => {
    const pathname = urlModule.parse(url_full).pathname;

    if (pathname === undefined) {
        return undefined;
    }

    return logNormalizePath(pathname);
};

//time in miliseconds
const getTime = (): number => new Date().getTime();

export class ApiTimeLog {
    private readonly time: number;

    public constructor(
        private readonly prettyFormat: boolean,
        private readonly method: string,
        private readonly url: string
    ) {
        this.time = getTime();
    }

    public show(responseCode: number): void {
        if (this.prettyFormat) {
            return;
        }

        const dataString: string = JSON.stringify({
            timestamp: Math.floor(Date.now() / 1000),
            level_value: 20000,
            level: 'info'.toUpperCase(),
            message: 'Api Timing',
            method: this.method,
            url_full: this.url,
            url_short: parseUrl(this.url),
            response_time: getTime() - this.time,
            http_status: responseCode
        });

        process.stdout.write(`${dataString}\n`);
    }

    public static createWithProcessEnv(method: string, url: string): ApiTimeLog {
        const prettyFormat = process.env['LOGS_FORMAT'] === 'pretty';
        return new ApiTimeLog(prettyFormat, method, url);
    }
}

interface ParamsType {
    method: string,
    url: string,
    body: unknown
}

export const openApiFormatLog = (prefix: string, params: ParamsType): ApiTimeLog => {
    const { method, url, body } = params;

    const prettyFormat = process.env['LOGS_FORMAT'] === 'pretty';

    if (prettyFormat) {
        console.warn(clc.red(`${prefix} ${JSON.stringify({
            method: method,
            url: url,
            body: body
        })}`));
    } else {
        console.warn(`${prefix} ${JSON.stringify({
            method: method,
            url: url
        })}`);
    }

    return new ApiTimeLog(prettyFormat, method, url);
};
