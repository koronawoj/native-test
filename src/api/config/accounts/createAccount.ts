import moment from 'moment';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';
import { fetchPost } from '@twoupdigital/realtime-server/libjs/fetch';
import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { CreateAccountErrorModel, CreateAccountModel, decodeCreateAccountErrorModel, decodeCreateAccountSuccessModel } from './createAccountDecode';
import { CountryCodesTypes } from 'src/config/countries';
import { Currency } from 'src/config/currency';
import { LoginIO } from 'src/api/config/accounts/login';

export const createSession = async (
    api_url: string,
    api_universe: string,
    api_username: string,
    api_password: string,
    role: string
): Promise<string> => {
    const decodeLoginIO = buildValidator('LoginIOProgram', LoginIO, true);
    const sessionResponse = await fetchPost({
        url: `${api_url}/sessions/${api_universe}/${role}`,
        body: {
            username: api_username,
            password: api_password,
            grant_type: 'password',
        },
        decode: decodeLoginIO,
    });

    if (sessionResponse.status === 200 || sessionResponse.status === 201) {
        return sessionResponse.bodyJson.access_token;
    }
    return '';
};

export type CreateAccountResponseType =
    { responseStatus: 'success'; data: CreateAccountModel } |
    { responseStatus: 'error'; data: CreateAccountErrorModel }
;

const decode = (
    status: number,
    data: ResponseType
): CreateAccountResponseType => {
    if (status === 200 && data.type === 'json') {
        return {
            responseStatus: 'success',
            data: decodeCreateAccountSuccessModel(data.json),
        };
    }

    if (status === 201 && data.type === 'json') {
        return {
            responseStatus: 'success',
            data: decodeCreateAccountSuccessModel(data.json),
        };
    }

    if (status === 422 && data.type === 'json') {
        return {
            responseStatus: 'error',
            data: decodeCreateAccountErrorModel(data.json),
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export const createAccount = {
    browser: {
        params: (params: CreateAccountInput): ParamsFetchType<CreateAccountInput> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/newUser',
                body: params,
            };
        },
        decode,
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/newUser',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<CreateAccountInput>): Promise<GenerateUrlApiType> => {
        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/create`,
            method: MethodType.POST,
            passToBackend: true,
            body: params.req.body
        };
    },
};

export interface CreateAccountInput {
    email: string;
    password: string;
    title: GenderTitle;
    firstName: string; //max50
    surname: string; //max 50
    birthDate: string; //Date
    country: CountryCodesTypes;
    currency: Currency;
    contactPreferences?: Array<ContactPreference>;
    postCode?: string; //max 10,
    addressLine1: string; //max 100
    addressLine2?: string; //max 100
    city: string; //max 50
    language?: string;
    mobilePhone: MobilePhoneModel;
    referrer?: string;
    incomeaccess?: string;
    promoID?: string;
    affiliate?: string;
}

interface MobilePhoneModel {
    country: CountryCodesTypes;
    prefix: string;
    number: string;
}

export class DateTimeValidator {
    public static deserialize(value: string): moment.Moment {
        const valueMoment = moment(value);

        if (!valueMoment.isValid()) {
            console.error('DateTime:deserialize - Value must be a time in ISO format');
        }

        return valueMoment;
    }

    public static serialize(value: Date): string {
        return value.toISOString().replace(/\.\d\d\d/, '');
    }
}

export class DateValidator {
    public static deserialize(value: string): moment.Moment {
        return DateTimeValidator.deserialize(value).startOf('day');
    }

    public static serialize(value: moment.Moment): string {
        return value.format('YYYY-MM-DD');
    }
}

export enum GenderTitle {
    MS = 'ms',
    MR = 'mr',
}

export enum ContactPreference {
    EMAIL = 'email',
    SMS = 'sms',
    PHONE = 'phone',
}

export enum AccountAgeVerificationEnum {
    PASSED = 'passed',
    NOT_CHECKED = 'not checked', //can be some problem from BE sometime we receive "not_checked" instead "not checked"
    FAILED = 'failed',
    UNKNOWN = 'unknown',
}

export enum AccountKycStatusEnum {
    PASSED = 'passed',
    NOT_CHECKED = 'not checked',
    FAILED = 'failed',
    REQUESTED = 'requested',
    REQUIRED = 'required',
    FB_FAILED = 'fb-failed',
    DOC_FAILED = 'doc-failed'
}

export enum AccountStatusEnum {
    ACTIVE = 'active',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
    BLOCKED = 'blocked',
    CLOSED = 'closed',
}

