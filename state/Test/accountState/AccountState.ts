import { AccountModel } from './AccountModel';
import { UserLoginState } from './UserLoginState';
import { computed, action } from 'mobx';
import { MobxMapAutoNew } from '../utils/MobxMapAutoNew';
import moment from 'moment';
import { WebsocketV1 } from 'src/appState/websocketV1/WebsocketV1';
import { LocalStorageState } from 'src/appState/LocalStorage/LocalStorageState';
import { FeatureState } from 'src/appState/FeatureState';
import { LoginResponseType } from 'src/api/config/accounts/login';
import { loginUser } from 'src/api/utils/loginUser';
import { ConfigComponents } from 'src/config/features/config';

export class AccountState {
    private ref: HTMLElement | null = null;
    private readonly userLoginState: UserLoginState;
    private readonly accountMap: MobxMapAutoNew<number, AccountModel>;
    private readonly featureState: FeatureState;
    private readonly config: ConfigComponents;

    public constructor(userLoginState: UserLoginState, websocketV1: WebsocketV1, localStorageState: LocalStorageState, featureState: FeatureState, config: ConfigComponents) {
        this.userLoginState = userLoginState;
        this.accountMap = new MobxMapAutoNew((userId: number) => new AccountModel(userId, websocketV1, localStorageState));
        this.featureState = featureState;
        this.config = config;
    }

    @computed public get account(): AccountModel | null {
        const userId = this.userLoginState.userId;
        if (userId === null) {
            return null;
        }

        return this.accountMap.get(userId);
    }

    @computed public get userCountryByIp(): string | null {
        return this.userLoginState.userIpCountry;
    }

    public get currency(): string | null {
        const data = this.account?.basicData.get();

        if (data?.type === 'ready') {
            return data.value.currency;
        }

        return null;
    }

    public get oddsFormat(): string | null {
        const data = this.account?.basicData.get();

        if (data?.type === 'ready') {
            return data.value.oddsFormat;
        }

        return null;
    }

    @computed public get isAuthorized(): boolean {
        return this.userLoginState.isAuthorized;
    }

    @computed public get daysLeftForFinishKyc(): string {
        const kycRequestExpireDate = this.account?.basicDataReady?.kycRequestExpireDate ?? null;

        if (kycRequestExpireDate === null) {
            return '14';
        }

        const momentExpireDate = moment(kycRequestExpireDate);
        const daysLeft = (momentExpireDate.diff(moment.now(), 'days', true) + 1).toString();
        const clearDays = daysLeft.split('.')[0];
        if (clearDays !== undefined) {
            return  Number(daysLeft)  < 1 ? '0' :  clearDays;
        }
        return '14';
    }

    @action public setRef = (ref: HTMLElement | null): void => {
        this.ref = ref;
    }

    @action public scrollAccountTab = (): void =>{
        if (this.ref !== null) {
            this.ref.scrollTo(0, 0);
        }
    }

    @action public loginUser = (email: string, password: string, type: 'login' | 'registration'): Promise<LoginResponseType> => {
        const disable_geo = this.featureState.allowCasinoInIOSWrapper() ? undefined : true;
        return loginUser(disable_geo, this, this.config.config, email, password, type);
    }
}
