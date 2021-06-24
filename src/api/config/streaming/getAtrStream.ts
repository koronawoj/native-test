import * as t from 'io-ts';
import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { openapi_streaming_getStream } from 'src/api_openapi/generated/openapi_streaming_getStream';

const modelConfig = {
    streams: buildApiItemDefault(buildValidator('ArrayIO', t.array(t.interface({ url: t.string })), true), null)
};


export const decodeStreamAtrModel = buildModelValidator('Get atr stream urls', modelConfig);
export type StreamAtrModelType = ReturnType<typeof decodeStreamAtrModel>;

const decode = (status: number, data: ResponseType): StreamAtrModelType  => {
    if (status === 200 && data.type === 'json') {
        const result = decodeStreamAtrModel(data.json);
        return result;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface StreamParamsType {
    id: number,
}

export const getAtrStream = {
    browser: {
        params: (params: StreamParamsType): ParamsFetchType<StreamParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/stream-general',
                body: params
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/stream-general',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<StreamParamsType>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        const streamId = params.req.body.id.toString();
        const resp = await openapi_streaming_getStream(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            streamMetadataId: streamId,
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString()
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }
};
