import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { createGuard } from 'src_common/common/createGuard';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

const SuccessResponseIO = t.interface({
    exists: t.boolean,
});

const isSuccessResponseIO = createGuard(SuccessResponseIO);

type SuccessResponse = t.TypeOf<typeof SuccessResponseIO>;

interface BodyTypes {
    email: string;
}

const decode = (status: number, data: ResponseType): SuccessResponse => {
    if (status === 200 && data.type === 'json') {
        if (isSuccessResponseIO(data.json)) {
            return data.json;
        } else {
            console.error('Decoder problem', data);
            return {
                exists: false
            };
        }
    }
    if (status === 404) {
        console.warn('Missing handler for check email');
        return {
            exists: false
        };
    }
    throw new Error(`unhandled response ${status} - ${data.type}`);
};


export const accountValidateEmail = {
    browser: {
        params: (email:string): ParamsFetchType<BodyTypes> => {
            return {
                type: MethodType.POST,
                url: '/api-web/check-email',
                body: {
                    email,
                }
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/check-email',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<BodyTypes>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/check-email/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.POST,
            body: {
                email: params.req.body.email,
            }
        };
    }
};
