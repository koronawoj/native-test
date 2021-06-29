import { ModelsState } from 'src/state/Test/websocket2/ModelsState';
import { LegItem } from './LegItem';
import { action, observable, computed } from 'mobx';
import { CombinationItem } from './CombinationItem';
import { AddToAllState } from './AddToAllState';
import { LegsState } from './LegsState';
import { CombinationState } from './CombinationsState';
import { CastBetsState } from './CastBetsState';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { GetPossibleBetsLegsRequestType, CombinationsRequestType, LegsForPossibleBetsType, CombinationsForPossibleBetsType } from 'src/state/Test/betSlipState/betting/getPossibleBetsTypes';
import { SuccessPlaceBetResponseType } from 'src/state/Test/betSlipState/betting/postPlaceBetTypes';
import { BasicBetSlipState } from './BasicBetSlipState';
import { BetSlipSummaryState } from './BetSlipSummaryState';
import { BetSlipUserDataType } from './BetSlipSheredTypes';
import { ConfigComponents } from 'src/config/features/config';
import { AccountState } from 'src/state/Test/accountState/AccountState';
import { BetsFilter, BetsState } from './BetsState/BetsState';
import { SyntheticEvent } from 'react';
import { WebsocketV1 } from 'src/state/Test/websocketV1/WebsocketV1';

export interface FilterType<T = string | number | null> {
    id: T,
    key: string,
    label: string | JSX.Element,
}

export enum BetSlipFilter {
    BETSLIP = 'BETSLIP',
    MY_BETS = 'MY_BETS',
}

export class BetSlipState {
    private readonly models: ModelsState;
    private readonly configComponents: ConfigComponents;

    public readonly possibleBetsRequestState: PossibleBetsRequestState;
    public readonly castBetsState: CastBetsState;
    public readonly basicBetSlipState: BasicBetSlipState;
    public readonly betSlipSummaryState: BetSlipSummaryState;
    public readonly legsState: LegsState;
    public refElem: HTMLElement | null = null;

    private readonly combinationState: CombinationState;
    public readonly accountState: AccountState;

    @observable private mapCorePrepareLegs: Map<number, LegsForPossibleBetsType>;
    @observable private mapCorePrepareCombinations: Map<string, CombinationsForPossibleBetsType>;
    @observable public selectedTab: string = BetSlipFilter.BETSLIP;


    public constructor(
        models: ModelsState,
        accountState: AccountState,
        configComponents: ConfigComponents,
        socket: WebsocketV1,
    ) {
        this.models = models;
        this.accountState = accountState;
        this.configComponents = configComponents;
        this.mapCorePrepareLegs = new Map();
        this.mapCorePrepareCombinations = new Map();

        this.possibleBetsRequestState = new PossibleBetsRequestState(this.models, this.getFreeBetsAmount, this.getMapCorePrepareLegs, this.getCoreCombinationsPossibleBetsRequest, this.getAccountData);
        this.basicBetSlipState = new BasicBetSlipState(this.possibleBetsRequestState, this.getAccountData);

        this.legsState = new LegsState(this.models, this.possibleBetsRequestState, this.accountState, this.getMapCorePrepareLegs, this.addMapCorePrepareLegs, this.setMapCorePrepareLegs, this.deleteMapCorePrepareLegsItem);
        this.combinationState = new CombinationState(this.models, this.possibleBetsRequestState, this.setMapCorePrepareCombinations, this.deleteMapCorePrepareCombinations);
        this.castBetsState = new CastBetsState(this.possibleBetsRequestState);
        this.betSlipSummaryState = new BetSlipSummaryState(this.possibleBetsRequestState, this.legsState, this.combinationState, this.basicBetSlipState, this.castBetsState, this.getFreeBetsAmount, this.configComponents, this.getLegsIds, this.getLegItemById, this.cleanAll, this.accountState);

        this.handleSavedBets();
    }

    public get filters(): FilterType[] {
        const betslipLabel = 'Betslip';

        const myBetsLabel = 'My bets';

        return [
            { id: BetSlipFilter.BETSLIP, key: BetSlipFilter.BETSLIP, label: betslipLabel },
            { id: BetSlipFilter.MY_BETS, key: BetSlipFilter.MY_BETS, label: myBetsLabel }
        ];
    }

    public getAccountData = (): BetSlipUserDataType => {
        if (this.accountState.account !== null) {
            const basicData = this.accountState.account.basicData.get();
            const walletData = this.accountState.account.walletData.get();

            if (basicData.type === 'ready' && walletData.type === 'ready') {
                return {
                    currency: basicData.value.currency,
                    country: basicData.value.country,
                    balance: walletData.value.playableBalance,
                    accountAuthenticated: true,
                    userId: basicData.value.id,
                };
            }
        }

        return {
            currency: 'EUR',
            country: 'UK',
            accountAuthenticated: false,
            userId: null,
            balance: null
        };
    }

    @action public changeBetslipTab = (tabName: string): void => {
        this.selectedTab = tabName;
    }

    @action public redirectToCashOut = (): void => {
    }

    @action public redirectToMyBetsOpen = (): void => {
    }

    @computed public get isActiveCashOutTab(): boolean {
        return false;
    }

    @action private onSaveBetsToLocalStorage = (): void => {
        const data = {
            legs: Array.from(this.mapCorePrepareLegs.values()),
            combinations: Array.from(this.mapCorePrepareCombinations.values())
        };
    }

    @action private handleSavedBets = (): void => {
    }

    @action private onResetCombinations = (): void => {
        this.mapCorePrepareCombinations = new Map();
        for (const combinationId of [...this.combinationsCast, ...this.combinationWithoutCast]) {
            this.combinationState.forViewCombinationsItemMap.delete(combinationId);
        }
    }

    @action private deleteMapCorePrepareCombinations = (): void => {
        this.mapCorePrepareCombinations = new Map();
        for (const combinationId of [...this.combinationsCast, ...this.combinationWithoutCast]) {
            this.combinationState.forViewCombinationsItemMap.delete(combinationId);
        }
    }

    @action public onRemoveAllLegs = (): void => {
        this.cleanAll();
    }

    @action private setMapCorePrepareLegs = (betId: number, legModel: GetPossibleBetsLegsRequestType): void => {
        this.mapCorePrepareLegs.set(betId, legModel);
        this.onSaveBetsToLocalStorage();
    }

    @action public deleteMapCorePrepareLegsItem = (betId: number): void => {
        this.onResetCombinations();
        this.mapCorePrepareLegs.delete(betId);
        this.legsState.forViewLegsItemMap.delete(betId);
        if (this.configComponents.config.betSlipLocalStorage) {
            this.onSaveBetsToLocalStorage();
        }
    }

    @action private deleteMapCorePrepareLegs = (): void => {
        this.mapCorePrepareLegs = new Map();

        this.onResetCombinations();
        if (this.configComponents.config.betSlipLocalStorage) {
            this.onSaveBetsToLocalStorage();
        }
    }

    @action private addMapCorePrepareLegs = (betId: number, legModel: GetPossibleBetsLegsRequestType): void => {

        this.mapCorePrepareLegs.set(betId, legModel);

        if (this.mapCorePrepareLegs.size === 1) {
            this.onUpdateQuickBet(true);
        } else {
            this.onUpdateQuickBet(false);
        }

        this.onResetCombinations();
        if (this.configComponents.config.betSlipLocalStorage) {
            this.onSaveBetsToLocalStorage();
        }
    }

    @action private setMapCorePrepareCombinations = (betId: string, legModel: CombinationsRequestType): void => {
        this.mapCorePrepareCombinations.set(betId, legModel);
        if (this.configComponents.config.betSlipLocalStorage) {
            this.onSaveBetsToLocalStorage();
        }
    }

    @action private cleanAll = (): void => {
        this.deleteMapCorePrepareLegs();

        this.combinationState.cleanCombinations();

        this.possibleBetsRequestState.prevCorePossibleBetsResponse = null;

        const legsItemKeys = this.legsState.forViewLegsItemMap.getAllKeys();
        const combinationsItemKeys = this.combinationState.forViewCombinationsItemMap.getAllKeys();

        for (const id of legsItemKeys) {
            this.legsState.forViewLegsItemMap.delete(id);
        }

        for (const id of combinationsItemKeys) {
            this.combinationState.forViewCombinationsItemMap.delete(id);
        }
    }

    public setRef = (ref: HTMLElement | null): void => {
        this.refElem = ref;
    }

    private getCoreCombinationsPossibleBetsRequest = (): Record<string, CombinationsRequestType> | null => {
        const tempObj: Record<string, CombinationsRequestType> = {};
        for (const [key, elem] of this.mapCorePrepareCombinations.entries()) {
            tempObj[key] = {
                legs: elem.legs,
                potentialReturns: elem.potentialReturns ?? 0,
                price: elem.price,
                ewOffered: elem.ewOffered ?? false,
                name: elem.name ?? '',
                maxStake: elem.maxStake,
                stakePerLine: elem.stakePerLine,
                potentialReturnsEw: elem.potentialReturns,
                potentialReturnsAt: elem.stakePerLine,
                numLines: elem.numLines ?? 1,
                type: elem.type,
                eachWay: elem.eachWay,
                freebetCredits: elem.freebetCredits,
                freebetRemarks: elem.freebetRemarks,
            };
        }
        return tempObj;
    }

    private getFreeBetsAmount = (): number | null => {
        return this.freeBetsAmount;
    }

    private getMapCorePrepareLegs = (): Map<number, GetPossibleBetsLegsRequestType> => {
        return this.mapCorePrepareLegs;
    }

    private getLegsIds = (): Array<number> => {
        return this.legsIds;
    }

    public getLegItemById = (legId: number): null | LegItem => {
        const existsInBetslip = this.legsIds.includes(legId);
        if (existsInBetslip === true) {
            return this.legsState.forViewLegsItemMap.get(legId);
        }
        return null;

    }

    public getCombinationItemById = (combinationType: string): null | CombinationItem => {
        return this.combinationState.forViewCombinationsItemMap.get(combinationType);
    }

    public getRabItemById = (rabType: string): null => {
        return null;
    }

    public getSelectionItemById = (typeId: string | number | null): null | LegItem | CombinationItem | AddToAllState => {
        if (typeId === null) {
            return null;
        }

        if (typeof typeId === 'number') {
            return this.getLegItemById(typeId);
        }

        if (typeId.substring(0, 3) === 'RAB') {
            return this.getRabItemById(typeId);
        }

        return this.getCombinationItemById(typeId);
    }

    private onUpdateQuickBet = (isShow: boolean): void => {
        this.basicBetSlipState.onUpdateQuickBet(isShow);
    }

    private onPlaceBetSuccess = (bets: Array<SuccessPlaceBetResponseType>): void => {
        this.betSlipSummaryState.onPlaceBetSuccess(bets);
    }

    @computed public get freeBetsAmount(): number | null {
        return null;
    }

    @computed public get shouldFreebetBeAllowed(): boolean {
        return this.freeBetsAmount !== null ? this.betSlipSummaryState.totalStake - this.freeBetsAmount > 0 : false;
    }

    @computed public get betsCounter(): number {
        return this.legsIds.length;
    }


    @computed private get legsRawIds(): Array<number> {
        const tempLegsIds: Set<number> = new Set();
        for (const leg of this.possibleBetsRequestState.coreLegsPossibleBetsRequest) {
            const selectionModel = this.models.getSelection(leg.selectionId);
            if (selectionModel !== null) {
                tempLegsIds.add(leg.selectionId);
            }
        }

        // return Array.from(tempLegsIds).reverse();
        return Array.from(tempLegsIds);
    }


    @computed private get legsRawIdsReverse(): Array<number> {
        const tempLegsIds: Set<number> = new Set();
        for (const leg of this.possibleBetsRequestState.coreLegsPossibleBetsRequest) {
            const selectionModel = this.models.getSelection(leg.selectionId);
            if (selectionModel !== null) {
                tempLegsIds.add(leg.selectionId);
            }
        }

        return Array.from(tempLegsIds).reverse();
    }

    // @computed public get allowedFreebet(): boolean {
    //     return this.freeBetsAmount - this.total
    // }

    @computed public get legsIds(): Array<number> {
        return this.legsRawIds;
    }

    @computed public get legsIdsReversed(): Array<number> {
        return this.legsRawIdsReverse;
    }



    @computed public get firstSelection(): number | null {
        if (this.legsIds.length === 1) {
            return this.legsIds[0] ?? null;
        }
        return null;
    }

    @computed public get combinationsCast(): Array<string> {

        const castTypes = ['FC', 'RFC', 'CFC', 'TC', 'CTC'];

        const combinationTypes: Array<string> = [];

        for (const combination of Array.from(this.possibleBetsRequestState.combinationsForViewMap.values())) {
            if (castTypes.includes(combination.type)) {
                combinationTypes.push(combination.type);
            }
        }

        return combinationTypes;
    }

    @computed public get combinationWithoutCast(): Array<string> {
        const castTypes = ['FC', 'RFC', 'CFC', 'TC', 'CTC'];

        if (this.basicBetSlipState.related || this.basicBetSlipState.relatedOnAdd) {
            return [];
        }

        const combinationTypes: Array<string> = [];

        for (const combination of Array.from(this.possibleBetsRequestState.combinationsForViewMap.values())) {
            if (!castTypes.includes(combination.type)) {
                combinationTypes.push(combination.type);
            }
        }

        return combinationTypes;
    }

    @action public onBetSlipClose = (e: SyntheticEvent): void => {
        e.preventDefault();

        if (document.body.classList.contains('is-keyboard-shown')) {
            document.body.classList.remove('is-keyboard-shown');
        }

        this.basicBetSlipState.onHideKeyboard();
    };
}
