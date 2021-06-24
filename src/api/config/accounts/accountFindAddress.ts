import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import qs from 'query-string';
import { fetchGeneralRaw, FetchGeneralRawResponseType } from 'src_common/common/fetch';
import { createGuard } from 'src_common/common/createGuard';

const ResponseItemIO = t.interface({
    Description: t.string,
    Highlight: t.string,
    Id: t.string,
    Text: t.string,
    Next: t.string,
    Cursor: t.string
});

const ResponseIO = t.array(ResponseItemIO);

const isResponse = createGuard(ResponseIO);

export type AddressResponseType = Array<AddressItemType>;

export type AddressItemType = t.TypeOf<typeof ResponseItemIO>;

const additionalRequest = async (params: GenerateUrlApiParamsType<ParamsType>): Promise<FetchGeneralRawResponseType> => {
    const query = qs.stringify({
        Key: params.POSTCODEANYWHERE_KEY,
        SearchFor: 'PostalCodes',
        SearchTerm: params.req.body.Text,
        LanguagePreference: 'en',
        Country: params.req.body.Countries
    });

    const response = await fetchGeneralRaw('GET', {
        url: `http://services.postcodeanywhere.co.uk/CapturePlus/Interactive/Find/v2.10/json.ws?${query}`,
        timeout: params.API_TIMEOUT,
    });

    return response;
};

const decode = (_status: number, data: ResponseType): Array<AddressItemType> => {
    if (data.type === 'json') {
        if (isResponse(data.json)) {
            return data.json.filter(item => item.Next === 'Retrieve');              //filter valid data
        }
        console.error('accountFindAddress - Decode error1', data.json);
        return [];
    }

    console.error('accountFindAddress - Decode error2', data);
    return [];
};

interface ParamsType {
    Countries: string,
    Text: string,
}

export const accountFindAddress = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/find-address',
                body: params
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/find-address',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {
        const additionalResponse = await additionalRequest(params);

        return {
            passToBackend: false,
            status: 200,
            responseBody: additionalResponse.body
        };
    }
};
