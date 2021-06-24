import { apiCommon } from 'src/api/ApiCommon';
import { Resource } from '../utils/Resource';
import { observable, computed, action } from 'mobx';
import { MobxMap } from 'src_common/common/mobx-utils/MobxMap';
import { AccountBasicDataModelType } from 'src/api/config/accounts/accountBasicDataDecode';
import { AccountWalletDataModelType } from 'src/api/config/accounts/accountWalletDataDecode';
import { AccountFreeBetsDataModelType } from 'src/api/config/accounts/accountFreeBetsDataDecode';
import { SavePaymentMethodsModelType } from 'src/api/config/accounts/accountSavedPaymentMethodsDecode';
import { BackofficeDepositsModelType } from 'src/api/config/accounts/backofficeDepositsDecode';
import { AccountAllBetsDataModelType } from 'src/api/config/accounts/accountAllBetsDataDecode';
import { AccountDepositLimitsDataModelType } from 'src/api/config/accounts/accountDepositLimitsDataDecode';
import { BankingConfigsModelType } from 'src/api/config/accounts/accountBankingConfigsDecode';
import { AccountRealityCheckDataModelType } from 'src/api/config/accounts/accountRealityCheckDataDecode';
import { AddressResponseType } from 'src/api/config/accounts/accountFindAddress';
import { AccountBonusesDataModelType, BonusModelType } from 'src/api/config/accounts/accountBonusesDataDecode';
import { TransactionParamsType } from 'src/api/config/accounts/accountTransactionHistoryData';
import { NetDepositDataModelType } from 'src/api/config/accounts/accountNetDepositsDataDecode';
import { ChangePasswordParamsType, ChangePasswordSuccessResponseType, ChangePasswordErrorResponseType } from 'src/api/config/accounts/accountChangePassword';
import { ChangePhoneParamsType } from 'src/api/config/accounts/accountChangePhoneNumber';
import { ChangePhoneModelType } from 'src/api/config/accounts/accountChangePhoneNumberDecode';
import { AccountSelfExclusionModelType, AccountSelfExclusionError } from 'src/api/config/accounts/accountSelfExclusionDataDecode';
import { UpdateRealityCheckModelType } from 'src/api/config/accounts/accountRealityCheckDataUpdateDecode';
import { AccountPlayBreakModelType, AccountPlayBreakError } from 'src/api/config/accounts/accountChangePlayBreakDecode';
import { TopUpParamsType, TopUpSuccessResponseType, TopUpErrorResponseType } from 'src/api/config/accounts/accountTopUpProcedure';
import { BackofficeDepositsSuccessResponseType } from 'src/api/config/accounts/backofficeDeposits';
import { Response200Type as GetActualLotteryType } from 'src/api_openapi/generated/openapi_lottery_getActualLottery';
import { BetsList } from './BetsList';
import { WebsocketV1 } from 'src/appState/websocketV1/WebsocketV1';
import { Response200Type } from 'src/api_openapi/generated/openapi_wallet_getTransactionHistory';
import { LocalStorageState } from 'src/appState/LocalStorage/LocalStorageState';

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

const createBetsHistory = (): MobxMap<[string | null, string | null], AccountAllBetsDataModelType> => new MobxMap(
    async ([from, to]: [FromToType, FromToType]): Promise<AccountAllBetsDataModelType> => {
        const resp = await apiCommon.accountAllBetsData.run({
            perPage: 250,
            from: from ?? undefined,
            to: to ?? undefined,
        });

        return resp;
    }
);

const createUserTransactionHistory = (): MobxMap<[StartDateType, EndDateType, TransactionParamsType], Response200Type> => new MobxMap(
    async ([startDate, endDate, transactionType]): Promise<Response200Type> => {
        const resp = await apiCommon.accountTransactionHistory.run({
            perPage: 250,
            page: 0,
            startDate: startDate,
            endDate: endDate,
            type: transactionType
        });

        return resp;
    }
);

const createUserNetDeposit = (): MobxMap<[StartDateType, EndDateType], NetDepositDataModelType> => new MobxMap(
    async ([startDate, endDate]): Promise<NetDepositDataModelType> => {
        const resp = apiCommon.accountNetDepositsData.run({
            perPage: 250,
            startDate: startDate,
            endDate: endDate,
        });

        return resp;
    }
);


export class AccountModel {
    private readonly userId: number;
    public readonly basicData: Resource<AccountBasicDataModelType>;
    public readonly walletData: Resource<AccountWalletDataModelType>;
    public readonly freeBetsData: Resource<ResponseType<AccountFreeBetsDataModelType>>;
    public readonly allBets: BetsList;
    public readonly savedPaymentMethod: Resource<SavePaymentMethodsModelType>;
    public readonly depositLimitsData: Resource<AccountDepositLimitsDataModelType>;
    public readonly realityCheckData: Resource<AccountRealityCheckDataModelType>;
    public readonly bankingConfigsData: Resource<BankingConfigsModelType>;
    public readonly backofficeDeposits: Resource<BackofficeDepositsModelType>;
    public readonly accountBonusesData: Resource<AccountBonusesDataModelType>;
    public readonly actualLottery: Resource<GetActualLotteryType | null>;

    @observable.ref public betsHistory: MobxMap<[string | null, string | null], AccountAllBetsDataModelType>;
    @observable.ref public userTransactionHistory: MobxMap<[StartDateType, EndDateType, TransactionParamsType], Response200Type>;
    @observable.ref public userNetDeposit: MobxMap<[StartDateType, EndDateType], NetDepositDataModelType>;

    public constructor(userId: number, websocketV1: WebsocketV1, private readonly localStorageState: LocalStorageState) {
        this.userId = userId;

        this.betsHistory = createBetsHistory();

        this.userTransactionHistory = createUserTransactionHistory();

        this.userNetDeposit = createUserNetDeposit();

        this.basicData = new Resource(async (): Promise<AccountBasicDataModelType> => {
            const resp = await apiCommon.accountBasicData.run({});

            if (resp.status === 200) {
                return resp.bodyJson;
            }

            throw Error(`AccountBasicDataModelType - Incorrect response code ${resp.status}`);
        });

        this.walletData = new Resource(async (): Promise<AccountWalletDataModelType> => {
            return await apiCommon.accountWalletData.run({});
        });

        this.freeBetsData = new Resource(async (): Promise<ResponseType<AccountFreeBetsDataModelType>> => {
            const resp = await apiCommon.accountFreeBetsData.run({});

            if (resp.status === 200) {
                return {
                    type: 'ok',
                    data: resp.bodyJson
                };
            }

            if (resp.status === 400) {
                return {
                    type: 'error',
                    errorMessage: 'No freeBets found',
                };
            }

            throw Error(`AccountFreeBetsDataModelType - Incorrect response code ${resp.status}`);
        });

        this.allBets = new BetsList(websocketV1, userId);

        this.depositLimitsData = new Resource(async (): Promise<AccountDepositLimitsDataModelType> => {

            return await apiCommon.accountDepositLimitsData.run({});
        });

        this.realityCheckData = new Resource(async (): Promise<AccountRealityCheckDataModelType> => {
            return await apiCommon.accountRealityCheckData.run({});
        });

        this.savedPaymentMethod = new Resource(async (): Promise<SavePaymentMethodsModelType> => {
            return await apiCommon.accountSavedPaymentMethod.run({});
        });

        this.bankingConfigsData = new Resource(async (): Promise<BankingConfigsModelType> => {
            return await apiCommon.accountBankingConfigs.run({});
        });

        this.backofficeDeposits = new Resource(async (): Promise<BackofficeDepositsModelType> => {
            const resp = await apiCommon.backofficeDeposits.run({});
            if (resp.status === 200) {
                return resp.bodyJson;
            }

            throw Error(`BackofficeDepositsModelType - Incorrect response code ${resp.status}`);
        });

        this.accountBonusesData = new Resource(async (): Promise<AccountBonusesDataModelType> => {
            return await apiCommon.accountBonusesData.run({});
        });

        this.actualLottery = new Resource(
            async (): Promise<GetActualLotteryType | null> => {
                return await apiCommon.actualLottery.run({});
            }
        );
    }

    @computed public get freeBetModel(): AccountFreeBetsDataModelType | null {
        const freeBetsData = this.freeBetsData.get();
        if (freeBetsData.type === 'ready' && freeBetsData.value.type === 'ok') {
            return freeBetsData.value.data;
        }
        return null;
    }

    public onFindAddress = async (Countries: string, Text: string): Promise<AddressResponseType> => {

        const response = await apiCommon.accountFindAddress.run({
            Countries,
            Text
        });

        return response;
    }

    public refreshAll = (): void => {
        this.basicData.refresh();
        this.walletData.refresh();
        this.freeBetsData.refresh();
        this.userTransactionHistory = createUserTransactionHistory();
        this.userNetDeposit = createUserNetDeposit();
        this.betsHistory = createBetsHistory();
    }

    public resetAll = (): void => {
        this.basicData.clear();
        this.walletData.clear();
        this.freeBetsData.clear();
    }

    @computed public get playableBalance(): number | null {
        const response = this.walletData.get();
        if (response?.type === 'ready') {
            return response.value.playableBalance;
        }
        return null;
    }

    @computed public get bonuses(): AccountBonusesDataModelType {
        const bonuses = this.accountBonusesData.get();
        if (bonuses?.type === 'ready') {
            return bonuses.value;
        }
        return [];
    }

    @computed public get bonusesMapByType(): Record<string,string> {
        return this.bonuses.reduce((previousValue:Record<string,string>, currentValue:BonusModelType) => {
            previousValue[currentValue.type] = currentValue.name;
            return previousValue;
        }, {});
    }

    @computed public get walletCurrency(): string | null {
        const response = this.walletData.get();
        if (response?.type === 'ready') {
            return response.value.currency;
        }
        return null;
    }

    @computed public get showBalanceInHeader(): boolean {
        return this.localStorageState.balanceInHeader.getValue();
    }

    @action public setBalanceInHeader = (value: boolean): void => {
        this.localStorageState.balanceInHeader.setValue(value);
    }

    @action public onChangeOddsType = async (oddsFormat: string): Promise<void> => {

        try {
            await apiCommon.changeOddsFormat.run({ oddsFormat: oddsFormat });
        } catch (error) {
            console.error(`changeOddsFormat - Incorrect response code ${String(error.status)}`);
        }
    }

    @action public onChangeContactPreferences = async (contactPreferences:Array<string>): Promise<void> => {

        try {
            const response = await apiCommon.accountContactPreferences.run({
                contactPreferences
            });

            if (response.status === 200) {
                this.basicData.refresh();
            }
        } catch (error) {
            console.error(`Contact prefereces - ${String(error.status)}`);
        }
    }

    @action public onChangePlayBreak = async (days: number): Promise<AccountPlayBreakModelType | AccountPlayBreakError> => {

        const response = await apiCommon.accountChangePlayBreak.run(
            days
        );

        if ( response.status !== 200) {
            return {
                status: 400,
                error: {
                    error: 'play break error',
                }
            };
        } else {
            this.basicData.refresh();
            return response.bodyJson;
        }
    }

    @action public onChangeSelfExclusion = async (months: string): Promise<AccountSelfExclusionModelType | AccountSelfExclusionError> => {

        const response = await apiCommon.accountSelfExclusionData.run(
            months
        );

        if ( response.status !== 200) {
            return {
                status: response.status,
                error: {
                    error: 'Self exclusion error',
                }
            };
        } else {
            this.basicData.refresh();
            return response.bodyJson;
        }
    }

    @action public onChangePassword = async ({ oldPassword, newPassword }: ChangePasswordParamsType): Promise<ChangePasswordSuccessResponseType | ChangePasswordErrorResponseType | undefined> => {
        const response = await apiCommon.accountChangePassword.run({
            newPassword,
            oldPassword
        });

        return response;
    }

    @action public onUpdateTopUpLimits = async (daily:number, weekly:number, monthly:number): Promise<void> => {
        await apiCommon.updateTopUpLimits.run({
            daily,
            weekly,
            monthly,
        });

        await this.depositLimitsData.refreshAndWait();
    }

    @action public onChangePhoneNumber = async({ prefixFullData, number }: ChangePhoneParamsType): Promise<ChangePhoneModelType> => {
        const response = await apiCommon.accountChangePhoneNumber.run({ number, prefixFullData });

        if (response.status === 200) {
            this.basicData.refresh();
            return response.bodyJson;
        }

        throw Error(`onChange phone number - Incorrect response code ${response.status}`);
    }

    @action public onUpdateRealityCheck = async (duration: string): Promise<UpdateRealityCheckModelType> => {
        const response = await apiCommon.accountRealityCheckDataUpdate.run({
            duration: parseInt(duration, 10),
        });

        if (response.status === 200) {
            this.realityCheckData.refresh();
            return response.bodyJson;
        }

        throw Error(`onRealityCheckUpdate - Incorrect response code ${response.status}`);
    };

    @action public onSendTopUpAmount = async(data:TopUpParamsType): Promise<TopUpSuccessResponseType | TopUpErrorResponseType> => {

        const response = await apiCommon.accountTopUpData.run(data);
        this.basicData.refresh();
        this.walletData.refresh();

        return response;
    };

    @action public onChangeRingFencedFlag = async(): Promise<boolean | null> => {

        const response = await apiCommon.accountChangeRingFencedFunds.run({ ringFencedFunds: true });
        this.basicData.refresh();

        return response;
    };

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

    @action public backofficeIdentities = async(): Promise<BackofficeDepositsSuccessResponseType | null> => {

        const response = await apiCommon.backofficeDeposits.run({});
        this.basicData.refresh();

        if ( response.status !== 200) {
            return null;
        } else {
            return response;
        }
    };

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

    @computed public get actualLotteryAccount(): GetActualLotteryType | null | 'loading' {
        const actualLotteryData = this.actualLottery.get();

        if (actualLotteryData.type === 'loading') {
            return 'loading';
        }

        if (actualLotteryData.type === 'ready') {
            return actualLotteryData.value;
        }

        return null;
    }
}
