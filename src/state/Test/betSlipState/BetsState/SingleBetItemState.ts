import { computed, observable, action } from 'mobx';
import { SingleBetResultModelType, BetLegsModelType, BetsFreeBetsType, BetsBonusesType } from 'src/api/config/accounts/accountAllBetsDataDecode';
import { CashOutItemType } from 'src/api/config/betting/cashOutsDataDecode';
import { apiCommon } from 'src/api/ApiCommon';
import { RetrieveCashOutErrorModelType } from 'src/api/config/betting/retrieveCashOutDecode';

export class SingleBetItemState {
    public readonly getBetById: () => SingleBetResultModelType | null
    public readonly getCashOutById: () => CashOutItemType | null

    @observable private isSelectionOpenInner: boolean;
    @observable private isConfirmInner: boolean;
    @observable private isShowSuccessCashOutInner: boolean;
    @observable private isCshOutLoadingInner: boolean;
    @observable private cashOutErrorsInner: RetrieveCashOutErrorModelType | null;

    constructor(
        getBetById: () => SingleBetResultModelType | null,
        getCashOutById: () => CashOutItemType | null,
    ) {
        this.getBetById = getBetById;
        this.getCashOutById = getCashOutById;
        this.isSelectionOpenInner = true;
        this.isConfirmInner = false;
        this.isShowSuccessCashOutInner = false;
        this.isCshOutLoadingInner = false;
        this.cashOutErrorsInner = null;
    }

    @computed get bet(): SingleBetResultModelType | null {
        return this.getBetById();
    }

    @computed get id(): number | null {
        return this.bet?.id ?? null;
    }

    @computed get type(): string | null {
        return this.bet?.type ?? null;
    }

    @computed get cashOutItem(): CashOutItemType | null {
        return this.getCashOutById();
    }

    @computed get legs(): BetLegsModelType {
        return this.bet?.legs ?? [];
    }

    @computed get freeBetCredits(): Array<BetsFreeBetsType> {
        return this.bet?.transaction.tags?.freebetCredits ?? [];
    }

    @computed get bonuses(): Array<BetsBonusesType> {
        return this.bet?.transaction.tags?.bonuses ?? [];
    }

    @computed get payout(): number | null {
        return this.bet?.payout ?? null;
    }

    @computed get potentialReturns(): number | null {
        return this.bet?.potentialReturns ?? null;
    }

    @computed get totalStake(): number | null {
        return this.bet?.totalStake ?? null;
    }

    @computed get status(): string {
        return this.bet?.status ?? '';
    }

    @computed get placedAt(): string | null {
        return this.bet?.placedAt ?? null;
    }

    @computed get tax(): number | null {
        return this.bet?.tax ?? null;
    }

    @computed get isAnyBP(): boolean {
        return this.legs.some(leg => leg.priceType === 'bp');
    }

    @computed get bogBonus(): BetsBonusesType | null {
        return this.bonuses.find(bonus => bonus.type === 'best-odds-guaranteed') ?? null;
    }

    @computed get resultTypes(): Array<string> {
        return this.legs.map(leg => leg.result?.type ?? '');
    }

    @computed get isAllTypeVoid(): boolean {
        return this.resultTypes.every((val) => val === 'void');
    }

    @computed get cashOut(): boolean {
        return this.bet?.cashOut ?? false;
    }

    @computed get isConfirm(): boolean {
        return this.isConfirmInner;
    }

    @computed get isLoadingCashOut(): boolean {
        return this.isCshOutLoadingInner;
    }

    @computed get isShowSuccessCashOut(): boolean {
        return this.isShowSuccessCashOutInner;
    }

    @action onConfirmCashOut = (): void => {
        if(this.isConfirmInner === false) {
            setTimeout(() => {
                this.isConfirmInner = false;
            }, 3000);
        }

        this.isConfirmInner = true;
    }

    @action public onRetrieveCashOut = async (): Promise<void> => {
        const betId = this.bet?.id ?? null;
        const value = this.cashOutItem?.value ?? null;

        if(betId !== null && value !== null && this.isCshOutLoadingInner === false) {
            this.isCshOutLoadingInner = true;

            const resp = await apiCommon.retrieveCashOut.run({
                betId: betId,
                value: value
            });

            this.isCshOutLoadingInner = false;

            if(resp.responseType === 'success') {
                this.isShowSuccessCashOutInner = true;
                setTimeout(() => {
                    this.isShowSuccessCashOutInner = false;
                }, 3000);
            }

            if(resp.responseType === 'error') {
                this.cashOutErrorsInner = resp.json;
            }

        }
    }

    @computed get cashOutErrors(): Array<string> {
        if(this.cashOutErrorsInner === null) {
            return [];
        }
        return this.cashOutErrorsInner.errors.map(elem => `${elem.resource}:${elem.code}`);
    }

    @action toggleSelectionOpen = (): void => {
        this.isSelectionOpenInner = !this.isSelectionOpenInner;
    }

    @action dismissError = (): void => {
        this.cashOutErrorsInner = null;
    }

    @computed get isSelectionOpen(): boolean {
        return this.isSelectionOpenInner;
    }
}
