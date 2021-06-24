import { MethodType, ParamsFetchType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault,  buildModelValidator } from 'src/api/utils/modelUtils';
import { AccountAgeVerificationEnum, AccountKycStatusEnum, AccountStatusEnum } from 'src/api/config/accounts/createAccount';


export type BackofficeDepositsSuccessResponseType = {
    status: 200,
    bodyJson: {
        status: {
            ageVerification: AccountAgeVerificationEnum,
            kycStatus: AccountKycStatusEnum,
            status: AccountStatusEnum
        }
    };
};


const accountStatusModel = {
    ageVerification: buildApiItemDefault(decodeString, ''),
    kycStatus: buildApiItemDefault(decodeString, ''),
    status: buildApiItemDefault(decodeString, '')
};

export const decodeAccountStatusModel = buildModelValidator('Create account success', accountStatusModel);
export type AccountStatusModel = ReturnType<typeof decodeAccountStatusModel>;

const decode = (status: number, data: ResponseType ): { responseStatus: 'success'; data: AccountStatusModel } => {
    if (status === 200 && data.type === 'json') {
        return {
            responseStatus: 'success',
            data: decodeAccountStatusModel(data.json),
        };
    }


    throw new Error(`unhandled response ${status} - ${data.type}`);
};

export interface accountStatusParamsType {
    token: string
}

export const accountStatus = {
    browser: {
        params: (params: accountStatusParamsType): ParamsFetchType<accountStatusParamsType> => {
            return {
                type: MethodType.POST,
                url: '/api-web/user/status',
                body: params
            };
        },
        decode: decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/user/status',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<accountStatusParamsType>): Promise<GenerateUrlApiType> => {

        return {
            url: `${params.API_URL}/accounts/${params.API_UNIVERSE}/customer/status?token=${params.req.body.token}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};
