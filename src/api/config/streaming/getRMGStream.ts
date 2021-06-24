import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeStringOrNull } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';
import { openapi_streaming_getRMGStream } from 'src/api_openapi/generated/openapi_streaming_getRMGStream';

const streamModel = {
    url: buildApiItemDefault(decodeStringOrNull, null)
};

export const decodeStreamModel = buildModelValidator('Get stream url', streamModel);

export type StreamModelType = ReturnType<typeof decodeStreamModel>;

const decode = (status: number, data: ResponseType): StreamModelType  => {
    if (status === 200 && data.type === 'json') {
        const result = decodeStreamModel(data.json);
        return result;
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface StreamParamsType {
    id: number;
    isMobile: boolean;
}

export const getRMGStream = {
    browser: {
        params: (params: StreamParamsType): ParamsFetchType<StreamParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/stream',
                body: params,
            };
        },
        decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/stream',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<StreamParamsType>): Promise<GenerateUrlApiType> => {
        const { id, isMobile } = params.req.body;
        const isMobileParam = isMobile === true ? 'mobile' : null;

        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                },
            };
        }

        const streamId = id.toString();
        const resp = await openapi_streaming_getRMGStream(params.API_URL, params.API_TIMEOUT, params.jwtToken, {
            streamMetadataId: streamId,
            universe: params.API_UNIVERSE,
            accountId: params.userSessionId.toString(),
            mobile: isMobileParam
        });

        return {
            passToBackend: false,
            status: resp.status,
            responseBody: resp.body
        };
    }

};
