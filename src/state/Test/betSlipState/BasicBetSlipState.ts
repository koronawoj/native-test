import { observable, computed, action } from "mobx";
import { PossibleBetsRequestState } from "./PossibleBetsState/PossibleBetsState";
import { PlayableBalanceAmountsType, BetSlipUserDataType } from "./BetSlipSheredTypes";
import { ErrorRawType } from "src/state/Test/betSlipState/betting/getPossibleBetsTypes";

export class BasicBetSlipState {

    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    private readonly getAccountData: () => BetSlipUserDataType;

    @observable private focusedSelectionIdInner: number | string | null = null;
    @observable private isFocusedAnyBetInput: boolean = false;
    @observable private isShowQuickBetInner: boolean = false;
    @observable private isSinglesOpen: boolean = true;
    @observable private isMultiplesOpen: boolean = true;
    @observable private isCombinationOpen: boolean = true;

    constructor(
        possibleBetsRequestState: PossibleBetsRequestState,
        getAccountData: () => BetSlipUserDataType
    ) {
        this.possibleBetsRequestState = possibleBetsRequestState;
        this.getAccountData = getAccountData;
    }

    @action public onFocusSelection = (focusedSelectionIdInner: number | string): void => {
        this.focusedSelectionIdInner = focusedSelectionIdInner;
        this.isFocusedAnyBetInput = true;
    }

    @action public onBlurBetInput = (): void => {
        this.isFocusedAnyBetInput = false;
    }

    @action public onHideKeyboard = (): void => {
        this.focusedSelectionIdInner = null;
    }

    @action public onUpdateQuickBet = (isShow: boolean): void => {
        if (isShow) {
            this.isShowQuickBetInner = true;
        } else {
            this.isShowQuickBetInner = false;
        }
    }

    @action public onCloseQuickBet = (changeToInvisibleState: () => void): void => {
        changeToInvisibleState();
        if (this.isVisibleQuickBet) {
            this.onHideKeyboard();
        }
        this.onUpdateQuickBet(false);
    }

    @action public onToggleSinglesOpen = (): void => {
        this.isSinglesOpen = !this.isSinglesOpen;
    }

    @action public onToggleMultiplesOpen = (): void => {
        this.isMultiplesOpen = !this.isMultiplesOpen;
    }

    @action public onToggleCombinationOpen = (): void => {
        this.isCombinationOpen = !this.isCombinationOpen;
    }

    @computed public get errors(): Array<ErrorRawType> {
        return this.possibleBetsRequestState.errors;
    }

    @computed public get betSlipPlayableBalanceAmounts(): PlayableBalanceAmountsType | null {
        return this.possibleBetsRequestState.playableBalanceAmounts ?? null;
    }

    @computed public get isLoadingButton(): boolean {
        return this.possibleBetsRequestState.isLoading;
    }

    @computed public get placeBetStatus(): string | null {
        return 'status';
    }

    @computed public get betSlipSinglesOnly(): boolean {
        return this.possibleBetsRequestState.isSinglesOnly;
    }

    @computed public get isShowQuickBet(): boolean {
        return this.isShowQuickBetInner;
    }

    @computed public get channel(): string {
        if(this.isVisibleQuickBet) {
            return 'quickbet';
        }

        const innerWidth = null;

        if (innerWidth !== null) {
            const maxResolutionForKeyBoard = innerWidth < 1024;
            if (maxResolutionForKeyBoard) {
                return 'mobile';
            }
        }

        return 'desktop';
    }

    @computed public get related(): boolean {
        return this.possibleBetsRequestState.isRelated;
    }

    @computed public get relatedOnAdd(): boolean {
        return this.possibleBetsRequestState.isRelatedOnAdd;
    }

    @computed public get focusedSelectionId(): number | string | null {
        return this.focusedSelectionIdInner;
    }

    @computed public get getIsFocusedAnyBetInput(): boolean {
        return this.isFocusedAnyBetInput;
    }

    @computed private get isBetSlipTabOpen(): boolean {
        return false;
    }

    @computed public get isVisibleQuickBet(): boolean {
        const innerWidth = null;
        if (innerWidth !== null) {
            const maxResolutionForQuickbet = innerWidth <= 768;
            return maxResolutionForQuickbet && !this.isBetSlipTabOpen && this.isShowQuickBet;
        }
        return false;
    }

    @computed public get isVisibleKeyBoard(): boolean {
        return false;
    }

    @computed public get isSinglesOpenForView(): boolean {
        return this.isSinglesOpen;
    }

    @computed public get isMultiplesOpenForView(): boolean {
        return this.isMultiplesOpen;
    }

    @computed public get isCombinationOpenForView(): boolean {
        return this.isCombinationOpen;
    }

    @computed public get userData(): BetSlipUserDataType {
        const accountData = this.getAccountData();
        return accountData;
    }
}