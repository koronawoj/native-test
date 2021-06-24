import * as t from 'io-ts';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { fetchGeneralRaw, FetchGeneralRawResponseType } from 'src_common/common/fetch';
import { createGuard } from 'src_common/common/createGuard';
import qs from 'query-string';

const ResponseItemIO = t.interface({
    PostalCode: t.string,
    City: t.string,
    Line1: t.string,
    Line2: t.string,
    CountryName: t.string,
    CountryIso2: t.string
});

const ResponseIO = t.array(ResponseItemIO);

const isResponse = createGuard(ResponseIO);

export type AddressDetailsResponseItemType = t.TypeOf<typeof ResponseItemIO>;


const additionalRequest = async (params: GenerateUrlApiParamsType<ParamsType>): Promise<FetchGeneralRawResponseType> => {
    const query = qs.stringify({
        Key: params.POSTCODEANYWHERE_KEY,
        Id: params.req.body.addressId,
    });

    const response = await fetchGeneralRaw('GET', {
        url: `http://services.postcodeanywhere.co.uk/CapturePlus/Interactive/retrieve/v2.10/json.ws?${query}`,
        timeout: params.API_TIMEOUT,
    });

    return response;
};

const decode = (_status: number, data: ResponseType): Array<AddressDetailsResponseItemType> => {
    if (data.type === 'json') {
        if (isResponse(data.json)) {
            return data.json;
        }
        console.error('accountAddressDetails - Decode error1', data.json);
        return [];
    }

    console.error('accountAddressDetails - Decode error2', data);
    return [];
};

interface ParamsType {
    addressId: string,
}

export const accountAddressDetails = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/account/address-details',
                body: params
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/account/address-details',
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
