import { action, autorun, computed, observable } from "mobx";
import { WebsocketV1 } from 'src/state/Test/websocketV1/WebsocketV1';
import { MobxMapAutoNew } from "../utils/MobxMapAutoNew";
import { AccountModel } from "./AccountModel";

const TIMEOUT = 1000;

const debounce = (callbackOriginal: () => void): (() => void) => {

    let timer: NodeJS.Timeout | null = null;

    return (): void => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            callbackOriginal();
            timer = null;
        }, TIMEOUT);
    };
};

export class AccountState {

    @observable isModalVisible: boolean;
    @observable userId: null | number;
    @observable accessToken: null | string;
    private readonly accountMap: MobxMapAutoNew<number, AccountModel>;

    constructor(private readonly websocketV1: WebsocketV1) {
        this.isModalVisible = false;
        this.userId = null;
        this.accessToken = null;

        this.accountMap = new MobxMapAutoNew((userId: number) => new AccountModel(userId, () => this.accessToken, websocketV1));


        autorun(() => {
            if (this.userId !== null) {
                this.websocketV1.subscribe(`${this.userId}:Wallet`, debounce(() => {
                    this.account?.refreshAll();
                }));
            }
        });
    }

    @action onChangeModalVisibility = () => {
        this.isModalVisible = !this.isModalVisible;
    }

    @action onLogin = async ({ login, password }: { login: string, password: string }): Promise<void> => {
        const response = await fetch('https://website-star.stg.sherbetcloud.com/api-web/user/session', {
            method: 'POST',
            body: JSON.stringify({
                //   username: login,
                //   password: password,
                email: 'wojciech.korona@twoupdigital.com',
                password: 'test1234',
                grant_type: 'password'
            }),
            headers: {
                'Content-Type': 'application/json',
                'x-forwarded-for': '::1'
            },
        });


        const resp = await response.json();
        console.log('resp',resp);
        this.userId = resp.accountId;
        this.accessToken = resp.access_token;
    }

    @computed public get account(): AccountModel | null {
        if (this.userId === null) {
            return null;
        }

        return this.accountMap.get(this.userId);
    }

    public get oddsFormat(): string | null {
        const data = this.account?.basicData.get();

        if (data?.type === 'ready') {
            return data.value.oddsFormat;
        }

        return null;
    }
}