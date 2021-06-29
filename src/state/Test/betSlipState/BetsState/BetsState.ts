import { AccountState } from 'src/appState/accountState/AccountState';
import { action, computed, observable } from 'mobx';
import {
    AccountAllBetsDataModelType,
    BetLegModelType,
    SingleBetResultModelType
} from 'src/api/config/accounts/accountAllBetsDataDecode';
import { MobxMapAutoNew } from '@twoupdigital/mobx-utils/libjs/MobxMapAutoNew';
import { SingleBetItemState } from './SingleBetItemState';
import {
    AccountCashOutErrorModelType,
    CashOutDataModelType,
    CashOutItemType,
    CashOutMainDataModelType
} from 'src/api/config/betting/cashOutsDataDecode';
import { WebsocketV1 } from 'src/appState/websocketV1/WebsocketV1';
import { CashoutDataState } from './CashoutDataState';
import { AccountBasicDataModelType } from 'src/api/config/accounts/accountBasicDataDecode';
import { FilterType } from 'src/universes/star/components/common/Filters/Filters.state';
import { ConfigComponents } from 'src/config/features/config';
import { LanguagesState } from 'src/appState/LanguagesState';

export enum BetsFilter {
    ALL = 'ALL',
    OPEN = 'OPEN',
    SETTLED = 'SETTLED',
    CASH_OUT = 'CASH_OUT',
}

export class BetsState {

    public readonly allCashOutsData: CashoutDataState;
    public singleBetItem: MobxMapAutoNew<number, SingleBetItemState>;

    @observable public selectedFilter: string = BetsFilter.OPEN;

    public constructor(
        public readonly accountState: AccountState,
        private readonly socket: WebsocketV1,
        private readonly configComponents: ConfigComponents,
        private readonly language: LanguagesState,
    ) {
        this.allCashOutsData = new CashoutDataState(
            accountState,
            this.socket,
        );

        this.singleBetItem = new MobxMapAutoNew((betId: number) => {
            return new SingleBetItemState(
                () => this.getBetById(betId),
                () => this.getCashOutById(betId),
            );
        });
    }

    @computed public get user(): AccountBasicDataModelType | null {
        const result = this.accountState.account?.basicData.get();
        if (result !== undefined && result.type === 'ready') {
            return result.value;
        }
        return null;
    }

    @computed public get openBetsCount(): number {
        return this.betsList.filter(elem => elem.status === 'open' || elem.status === 'parked').length;
    }

    @computed public get getLabelForOpenTab(): string {
        const count = this.openBetsCount;
        const baseName = this.language.getTranslation('betslip.tabs.open', 'Open');

        if (count > 0) {
            return `${baseName} (${count})`;
        }

        return baseName;
    }

    @computed public get filters(): FilterType[] {
        const { getTranslation } = this.language;
        const { hasCashoutEnabled } = this.configComponents.config;
        const hasUserCashoutEnabled = this.user !== null ? this.user.cashoutEnabled : false;
        const isCashoutEnabled = hasCashoutEnabled && hasUserCashoutEnabled;

        return [
            {
                id: BetsFilter.ALL,
                key: BetsFilter.ALL,
                label: getTranslation('betslip.tabs.all', 'All')
            },
            {
                id: BetsFilter.OPEN,
                key: BetsFilter.OPEN,
                label: this.getLabelForOpenTab,
            },
            ...(isCashoutEnabled ?
                [
                    {
                        id: BetsFilter.CASH_OUT,
                        key: BetsFilter.CASH_OUT,
                        label: getTranslation('betslip.tabs.cash-out', 'Cash Out')
                    }
                ] : []
            ),
            {
                id: BetsFilter.SETTLED,
                key: BetsFilter.SETTLED,
                label: getTranslation('betslip.tabs.settled', 'Settled')
            }
        ];
    }


    public getBetItemById = (id: number): SingleBetItemState => {
        return this.singleBetItem.get(id);
    }

    @computed public get filteredBySelectedFilter(): Array<SingleBetResultModelType> {
        if (this.selectedFilter === BetsFilter.OPEN) {
            return this.betsList.filter(elem => elem.status === 'open' || elem.status === 'parked');
        }

        if (this.selectedFilter === BetsFilter.SETTLED) {
            return this.betsList.filter(elem => elem.status === 'settled');
        }

        if (this.selectedFilter === BetsFilter.CASH_OUT) {
            const cashOutsListValues: Array<SingleBetResultModelType> = [];
            const cashOutsList = this.cashOutsList?.cashouts ?? null;
            if (cashOutsList !== null) {
                for (const bet of this.betsList) {
                    const cashOut = this.getCashOutById(bet.id);
                    if (cashOut !== null && cashOut.enabled && cashOut.value > 0) {
                        cashOutsListValues.push(bet);
                        continue;
                    }

                    if (this.getBetItemById(bet.id).isShowSuccessCashOut) {
                        cashOutsListValues.push(bet);
                        continue;
                    }
                }
            }

            return cashOutsListValues;
        }

        return this.betsList;
    }

    @computed public get betsListForView(): Array<number> {
        const filteredList = this.filteredBySelectedFilter;
        return filteredList.map(elem => elem.id).slice(0, 250);
    }

    @action public changeSelectedFilter = (filterName: string | null): void  => {
        this.selectedFilter = filterName ?? BetsFilter.ALL;
    }

    @computed public get allBetsResource(): AccountAllBetsDataModelType | null {
        if (this.accountState.account !== null) {
            return this.accountState.account.allBets.list;
        }
        return null;
    }

    @computed public get isLoading(): boolean {
        return this.allBetsResource === null;
    }


    @computed public get betsList(): Array<SingleBetResultModelType> {
        if (this.allBetsResource !== null) {
            return this.allBetsResource.results;
        }
        return [];
    }

    @computed public get betsListMap(): Map<number, SingleBetResultModelType> {
        const betsListMap: Map<number, SingleBetResultModelType> = new Map();

        for (const bet of this.betsList) {
            betsListMap.set(bet.id, bet);
        }

        return betsListMap;
    }

    public getBetById = (id: number): SingleBetResultModelType | null => {
        const bet = this.betsListMap.get(id);
        return bet ?? null;
    }

    @computed public get allCashOutsResource(): CashOutMainDataModelType | AccountCashOutErrorModelType | null {
        const { account } = this.accountState;
        if (account !== null && account.cashoutEnabled === true) {
            return this.allCashOutsData.get();
        }
        return null;
    }


    @computed public get cashOutsList(): CashOutDataModelType | null {
        const allCashOutsResource = this.allCashOutsResource;

        if (allCashOutsResource === null) {
            return null;
        }

        if (allCashOutsResource.type === 'success') {
            return allCashOutsResource.data;
        }

        return null;
    }

    public getCashOutById = (id: number): CashOutItemType | null => {
        const cashOuts = this.cashOutsList?.cashouts ?? null;
        if (cashOuts !== null) {
            const cashOut = cashOuts[id];
            return cashOut ?? null;
        }
        return null;
    }

    @computed public get isBogEnabled(): boolean {
        const accountData = this.accountState.account?.basicData.get();
        return accountData?.type === 'ready' ? accountData.value.bpEnabled : false;
    }

    @computed private get oddsFormat(): string {
        const odds = this.accountState.oddsFormat;
        return odds !== null ? odds : 'f';
    }

    public getLegPrice = (leg: BetLegModelType, type?: string): string => {
        const spPrice = leg.spPrice ?? null;
        const price = leg.price ?? null;



        if (leg.priceType === 'sp' && spPrice === null) {
            return 'SP';
        }

        if (spPrice !== null) {
            const isBP = leg.priceType === 'bp';
            const spPriceD = spPrice.d;
            const priceD = price?.d ?? null;
            const priceF = price?.f ?? null;

            if (type === 'sp') {
                if (isBP) {
                    return this.oddsFormat === 'decimal' ? spPrice.d.toFixed(2) : spPrice.f;
                }
                return '';
            }

            if (priceD !== null && priceF !== null && isBP && spPriceD < priceD) {
                return this.oddsFormat === 'decimal' ? priceD.toFixed(2) : priceF;
            }

            if (isBP && priceD !== null && priceF !== null) {
                return this.oddsFormat === 'decimal' ? priceD.toFixed(2) : priceF;
            }

            return this.oddsFormat === 'decimal' ? spPrice.d.toFixed(2) : spPrice.f;
        }

        if (price !== null) {
            const priceD = price.d ?? null;
            const priceF = price.f ?? null;
            if (this.oddsFormat === 'decimal' && priceD !== null) {
                return priceD.toFixed(2);
            }
            return priceF ?? 'n/a';
        }
        return 'n/a';
    }


    public getIsBetSP = (legs:Array<BetLegModelType>): boolean => {
        return legs.some(leg => leg.priceType === 'sp');
    };
}
