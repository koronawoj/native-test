import { computed, action, observable } from 'mobx';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { FreeBetRemarksType } from './BetSlipSheredTypes';


export interface CastBetsStateTypes {
    totalStake: number,
    potentialReturns: number | null,
    tax: number | null,
    stakePerLine: number,
    freebetRemarks: Array<FreeBetRemarksType> | null,
    shouldShow: boolean;

}

export class CastBetsState {
    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    @observable private showTaxInfoInner: boolean = false;
    @observable private successTaxValueInner: number = 0;
    @observable public minOddsValue: number | undefined = undefined;


    public constructor(possibleBetsRequestState: PossibleBetsRequestState) {
        this.possibleBetsRequestState = possibleBetsRequestState;
    }

    @action public showTaxNote = (): void => {
        this.showTaxInfoInner = true;
    }

    @action public closeTaxNote = (): void => {
        this.showTaxInfoInner = false;
    }

    @action public setSuccessTaxValue = (value:number): void => {
        this.successTaxValueInner = value;
    }

    @action public setMinOddsValue = (value: number): void => {
        this.minOddsValue = value;
    }

    @computed public get showTaxInfo(): boolean {
        return this.showTaxInfoInner;
    }

    @computed public get successTaxValue(): number {
        return this.successTaxValueInner;
    }

    @computed private get castBetsRaw(): Array<CastBetsStateTypes> {
        const tempCastBets: Array<CastBetsStateTypes> = [];
        const rawCastBets = [...Array.from(this.possibleBetsRequestState.combinationsForViewMap.values()), ...this.possibleBetsRequestState.parsedLegsPossibleBetsResponse];

        for (const cast of rawCastBets) {


            if (cast.stakePerLine !== undefined && cast.stakePerLine !== null) {
                const castElem: CastBetsStateTypes = {
                    totalStake: cast.totalStake ?? 0,
                    potentialReturns: cast.potentialReturns,
                    tax: cast.tax,
                    stakePerLine: cast.stakePerLine,
                    freebetRemarks: cast.freebetRemarks,
                    shouldShow: (this.minOddsValue !== undefined && cast.price) ? cast.price.d <= this.minOddsValue : false
                };
                tempCastBets.push(castElem);
            }
        };
        return tempCastBets;
    }

    @computed public get shouldDisplayMinOdds(): boolean {
        return this.castBetsRaw.some((elem: CastBetsStateTypes) => elem.shouldShow === true) === true;
    }

    @computed public get tax(): number | null {
        let tempTax = 0;
        for (const castBet of this.castBetsRaw) {
            if (castBet.tax !== null) {
                tempTax += castBet.tax;
            }
        }
        return tempTax;
    }

    @computed public get showCredit(): boolean {
        return !this.isFreeBetExceedsAmount;
    }

    @computed public get minOdds(): string {

        for (const bet of this.castBetsRaw) {
            if (bet.freebetRemarks !== null) {
                for (const remark of bet.freebetRemarks) {
                    if (remark.code === 'minimum' && remark.details.minimum !== undefined) {
                        return remark.details.minimum;
                    }
                }
            }
        }

        return 'n/a';
    }


    @computed public get minOddsWarning(): boolean {
        for (const bet of this.castBetsRaw) {
            if (bet.stakePerLine > 0 && bet.freebetRemarks !== null) {
                for (const remark of bet.freebetRemarks) {
                    if (remark.code === 'minimum' && remark.details.minimum !== undefined) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    @computed public get taxInfoContent(): null {
        return null;
    }

    private isFreeBetExceedsAmountForRemark = (freebetRemarkItem: FreeBetRemarksType, totalStake: number): boolean => {
        const required = freebetRemarkItem.details.required ?? null;

        if (required !== null && typeof required === 'number') {
            if (required === totalStake) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

    @computed public get isFreeBetExceedsAmount(): boolean {
        for (const bet of this.castBetsRaw) {
            if (bet.stakePerLine > 0 && bet.freebetRemarks !== null  && bet.freebetRemarks.length > 0) {
                for (const remark of bet.freebetRemarks) {
                    if (this.isFreeBetExceedsAmountForRemark(remark, bet.totalStake)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}
