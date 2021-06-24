import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import * as t from 'io-ts';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { createGuard } from 'src_common/common/createGuard';

const NotificationIO = t.interface({
    id: t.number,
    title: t.string,
    background: t.union([
        t.interface({
            label: t.string,
            url: t.string,
            width: t.number,
            height: t.number,
            alt_text: t.union([t.string, t.null]),
            caption: t.union([t.string, t.null]),
            sha1: t.string,
        }),
        t.null
    ]),
    content: t.union([t.string, t.null]),
    button_label: t.union([t.string, t.null]),
    button_url: t.union([t.string, t.null]),
    event_id: t.union([t.string, t.null]),
    market_id:  t.union([t.string, t.null]),
    selection_id: t.union([t.string, t.null]),
    date_start:  t.union([t.string, t.null, t.undefined]),
    date_stop: t.union([t.string, t.null, t.undefined]),
});

const isNotification = createGuard(t.array(NotificationIO));

export type NotificationType = t.TypeOf<typeof NotificationIO>;

const decodeResponse = buildValidator('get notifications -> ResponseIO', NotificationIO, true);

export const decodeNotifications = decodeResponse;

const decode = (status: number, data: ResponseType): Array<NotificationType> => {
    if (status === 200 && data.type === 'json') {
        if (isNotification(data.json)) {
            return data.json;
        }

        throw Error('get notifications - decode error');
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const getNotifications = {
    browser: {
        params: (): ParamsFetchType<void> => {
            return {
                type: MethodType.GET,
                url: '/api-web/cms/notifications'
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.GET,
        urlBrowser: '/api-web/cms/notifications',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<void>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/cms/notifications/${params.API_UNIVERSE}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
