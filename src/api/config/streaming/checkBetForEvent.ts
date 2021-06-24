import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeNumber, decodeString } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';

const checkBetForEventModel = {
    universe: buildApiItemDefault(decodeString, ''),
    accountId: buildApiItemDefault(decodeNumber, 0),
    eventId: buildApiItemDefault(decodeNumber, 0),
    stake: buildApiItemDefault(decodeNumber, 0)
};

export const decodeStreamModel = buildModelValidator('Check bet for event', checkBetForEventModel);

export type StreamModelType = ReturnType<typeof decodeStreamModel>;

const decode = (status: number, data: ResponseType): StreamModelType  => {
    if (status === 200 && data.type === 'json') {
        const result = decodeStreamModel(data.json);
        return result;
    }


    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface CheckBetParamsType {
    eventId: number,
}

export const getCheckBetForEvent = {
    browser: {
        params: (params: CheckBetParamsType): ParamsFetchType<CheckBetParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/bet-for-event',
                body: {
                    eventId: params.eventId
                }
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/bet-for-event',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<CheckBetParamsType>): Promise<GenerateUrlApiType> => {
        if (params.userSessionId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    errorMessage: 'User id invalid',
                }
            };
        }

        return {
            url: `${params.API_URL}/streaming-api/bets-stake-event/accounts/${params.API_UNIVERSE}/${params.userSessionId}/events/${params.req.body.eventId}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
