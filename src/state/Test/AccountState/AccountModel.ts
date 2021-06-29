import { Resource } from 'src/state/Test/utils/Resource';
import { computed } from 'mobx';
import { AccountBasicDataModelType } from 'src/api/config/accounts/accountBasicDataDecode';
import { AccountWalletDataModelType } from 'src/api/config/accounts/accountWalletDataDecode';
import { WebsocketV1 } from 'src/state/Test/websocketV1/WebsocketV1';
import { fetchGet } from 'src/state/Test/utils/fetch';
import { buildValidator } from '../utils/buildValidator';
import * as t from 'io-ts';

const BasicDataIO = t.interface({
    status: t.number,
    bodyJson: t.unknown
})

const decodeResponseBasicData = buildValidator('getBets -> ResponseIO', BasicDataIO, true);


type ResponseType<R> = {
    type: 'ok',
    data: R
} | {
    type: 'error',
    errorMessage: string,
};

type StartDateType = string | undefined;
type EndDateType = string | undefined;
type FromToType = string | null;


export class AccountModel {
    private readonly userId: number;
    private readonly accessToken: string | null;
    public readonly basicData: Resource<AccountBasicDataModelType>;
    public readonly walletData: Resource<AccountWalletDataModelType>;

    public constructor(userId: number, getAccessToken: () => string | null, websocketV1: WebsocketV1) {
        this.userId = userId;
        this.accessToken = getAccessToken();

        this.basicData = new Resource(async (): Promise<AccountBasicDataModelType> => {

            const accessToken = getAccessToken();
            const response = await fetch('https://website-star.stg.sherbetcloud.com/api-web/account/basic-data', {
                method: 'GET',
                headers: {
                    'Cookie': `website.sid=${accessToken}`
                },
                
                credentials: "same-origin",
            })

            const resp = await response.json();
            console.log('resp',resp);

            // const resp = await fetchGet({
            //     url:`https://website-star.stg.sherbetcloud.com/api-web/account/basic-data`,
            //     extraHeaders: {
            //         'Cookie': `website.sid=${accessToken}`
            //     },
            //     decode: decodeResponseBasicData,
            // });

            console.log('accessToken',accessToken);
            console.log('basicData',resp);



            if (resp.status === 200) {
                return resp.bodyJson;
            }

            throw Error(`AccountBasicDataModelType - Incorrect response code ${resp.status}`);
        });

        this.walletData = new Resource(async (): Promise<AccountWalletDataModelType> => {
            return await null; // apiCommon.accountWalletData.run({});
        });
    }

    public refreshAll = (): void => {
        this.basicData.refresh();
        this.walletData.refresh();
    }

    public resetAll = (): void => {
        this.basicData.clear();
        this.walletData.clear();
    }

    @computed public get playableBalance(): number | null {
        const response = this.walletData.get();
        if (response?.type === 'ready') {
            return response.value.playableBalance;
        }
        return null;
    }

    @computed public get walletCurrency(): string | null {
        const response = this.walletData.get();
        if (response?.type === 'ready') {
            return response.value.currency;
        }
        return null;
    }

    public getId = (): number => {
        return this.userId;
    }

    @computed public get name(): string | null {
        const basicData = this.basicData.get();
        if (basicData.type === 'ready') {
            return basicData.value.name;
        }

        return null;
    }

    @computed public get basicDataReady(): AccountBasicDataModelType | null {
        const basicData = this.basicData.get();
        if (basicData.type === 'ready') {
            return basicData.value;
        }

        return null;
    }

    @computed public get cashoutEnabled(): boolean {
        return this.basicDataReady?.cashoutEnabled ?? false;
    }

    @computed public get cancelWithdrawal(): boolean {
        return this.basicDataReady?.cancelWithdrawal ?? false;
    }

    @computed public get kycStatus(): string | undefined {
        if (this.basicDataReady !== null) {
            return this.basicDataReady.kycStatus;
        }
    }
}
