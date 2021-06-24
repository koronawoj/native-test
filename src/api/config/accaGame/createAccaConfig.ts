import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';

export const NewAccaIO = t.interface({
    creator: t.interface({
        accountId: t.number
    }),
    name: t.string,
    stake: t.number
});
const SuccessResonseIO = t.interface({
    status: t.literal(201),
    bodyJson: NewAccaIO
});
const ErrorStatusIO = t.union([t.literal(401), t.literal(403), t.literal(404)]);
export type CreateAccaErrorStatusPropsType = t.TypeOf<typeof ErrorStatusIO>;
const ErrorResponseIO = t.union([
    t.interface({
        status: t.literal(400),
        bodyJson: t.interface({
            code: t.literal('teamaccas-teams-addAcca-uniqueAccaName-violation'),
            message: t.literal('Acca with given name already exists.')
        })
    }),
    t.interface({
        status: ErrorStatusIO,
        bodyJson: t.unknown,
    })
]);
const ResponseIO = t.union([SuccessResonseIO, ErrorResponseIO]);
const decodeResponse = buildValidator('createAcca -> ResponseIO', ResponseIO, true);
export type NewAccaType = t.TypeOf<typeof NewAccaIO>;
export interface CreateAccaParamsType {
    teamId: number,
    data: NewAccaType;
};
export interface User {
    name: string,
    id: number,
}

export const createAccaConfig = {
    browser: {
        params: (params: CreateAccaParamsType): ParamsFetchType<NewAccaType> => {
            return {
                type: MethodType.POST,
                url: `/api-web/teamaccas/teams/${params.teamId}/accas`,
                body: params.data
            };
        },
        decode: decodeResponse
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/teamaccas/teams/:teamId/accas',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<NewAccaType>): Promise<GenerateUrlApiType> => {
        return {
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            url: `${params.API_URL}/teamaccas/teams/${params.req.params.teamId}/accas`,
            passToBackend: true,
            method: MethodType.POST,
        };
    }
};
