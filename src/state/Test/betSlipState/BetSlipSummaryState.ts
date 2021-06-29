import { computed, action, observable } from 'mobx';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { LegsState } from './LegsState';
import { CombinationState } from './CombinationsState';
import { BasicBetSlipState } from './BasicBetSlipState';
import { LegItem } from './LegItem';
import { SuccessPlaceBetResponseType } from 'src/state/Test/betSlipState/betting/postPlaceBetTypes';
import { postPlaceBet, PlaceBetRequestType, RabBetType } from 'src/state/Test/betSlipState/betting/postPlaceBet';
import { CastBetsState } from './CastBetsState';
import { ConfigComponents } from 'src/config/features/config';
import { AccountState } from 'src/state/Test/accountState/AccountState';

interface BetDetailsLegsType {
    selectionName: string;
    marketName: string;
    eventName: string;
    priceBet: string | null;
    betId: number;
    stake: number;
    potentialReturns: number | null;
}

interface BetReceiptType {
    totalStake: number;
    totalPotentialReturns: string | number;
    isFreeBet: boolean;
    details?: {
        legs: Array<BetDetailsLegsType>
    }
}

type ErrorMsgType = 'BET-TOO-HIGH' | 'BET-TOO-LOW' | 'PAYOUT-TOO-HIGH' | 'MAX-BET-EXCEEDED' | 'INTERNAL_SERVER_ERROR_MESSAGE';
type PlaceBetStatus = 'SUCCESS' | 'IN_PROGRESS' | 'ERROR';

export class BetSlipSummaryState {
    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    private readonly legsState: LegsState;
    private readonly combinationState: CombinationState;
    private readonly basicBetSlipState: BasicBetSlipState;
    private readonly castBetsState: CastBetsState;
    private readonly getFreeBetsAmount: () => number | null;
    private readonly configState: ConfigComponents;
    private readonly getLegsIds: () => Array<number>;
    private readonly getLegItemById: (legId: number) => null | LegItem;
    private readonly onCleanAll: () => void;
    private readonly accountState: AccountState;

    @observable private betReceiptSummary: BetReceiptType | null = null;
    // todo use Resource
    @observable public placeBetStatus: PlaceBetStatus | null = null;
    @observable private responseErrorMsgInner: Set<ErrorMsgType> = new Set();

    @observable public betTooHighValue: number | null = null;

    public constructor(
        possibleBetsRequestState: PossibleBetsRequestState,
        legsState: LegsState,
        combinationState: CombinationState,
        basicBetSlipState: BasicBetSlipState,
        castBetsState: CastBetsState,
        getFreeBetsAmount: () => number | null,
        configState: ConfigComponents,
        getLegsIds: () => Array<number>,
        getLegItemById: (legId: number) => null | LegItem,
        onCleanAll: () => void,
        accountState: AccountState
    ) {
        this.possibleBetsRequestState = possibleBetsRequestState;
        this.legsState = legsState;
        this.combinationState = combinationState;
        this.basicBetSlipState = basicBetSlipState;
        this.castBetsState = castBetsState;
        this.getFreeBetsAmount = getFreeBetsAmount;
        this.configState = configState;
        this.getLegsIds = getLegsIds;
        this.getLegItemById = getLegItemById;
        this.onCleanAll = onCleanAll;
        this.accountState = accountState;
    }

    @computed public get freeBetsAmount(): number | null {
        return this.getFreeBetsAmount();
    }

    @computed public get prepareRabBets(): Array<RabBetType> {
        return [];
    };

    @action public onPlaceBet = (): void => {
        if (this.isDisabledBettingButton === false) {
            const { accountAuthenticated } = this.basicBetSlipState.userData;

            if (
                this.basicBetSlipState.placeBetStatus === 'IN_PROGRESS' ||
                this.isLegsChangedWarning ||
                accountAuthenticated === false ||
                (this.possibleBetsRequestState.castBets.length === 0  && this.possibleBetsRequestState.coreRabPossibleBetsResponse?.length === 0)||
                (this.basicBetSlipState.betSlipPlayableBalanceAmounts !== null && this.possibleBetsRequestState.fromFreeBets === false) ||
                (this.possibleBetsRequestState.fromFreeBets === true && this.castBetsState.isFreeBetExceedsAmount)
            ) {
                return;
            }

            if (this.castBetsState.tax !== null) {
                this.castBetsState.setSuccessTaxValue(this.castBetsState.tax);
            }

            const data: PlaceBetRequestType = {
                channel: this.basicBetSlipState.channel !== '' ? this.basicBetSlipState.channel : 'desktop',
                combinations: this.combinationState.forPlaceBet,
                legs: this.legsState.forPlaceBet,
                rabBets: this.prepareRabBets,
                isFreeBet: this.possibleBetsRequestState.fromFreeBets,
                isFreeBetTax: false,
            };

            this.onPlaceBetRequest(data);
            this.basicBetSlipState.onHideKeyboard();
        }
    }

    @computed public get isPlacingBet(): boolean {
        return this.placeBetStatus === 'IN_PROGRESS';
    }

    @action public onFreeBet = (): void => {
        //TODO: This method is to improve

        //set free bet flag true
        this.possibleBetsRequestState.onChangeFreeBetOption();
        this.onPlaceBet();
    }

    @action private onPlaceBetRequest = async (data: PlaceBetRequestType): Promise<void> => {
        if (this.placeBetStatus === 'IN_PROGRESS') {
            return;
        }
        this.placeBetStatus = 'IN_PROGRESS';
        const response = await postPlaceBet(data);
        if (response !== null && response.status === 'success' && response.data === null) {
            this.placeBetStatus = 'SUCCESS';
        }
        if (response !== null && response.status === 'success' && response.data !== null) {
            this.placeBetStatus = 'SUCCESS';
            this.onPlaceBetSuccess(response.data);
        }
        if (response !== null && response.status === 'error' && response.data !== null && response.data !== undefined) {
            this.placeBetStatus = 'ERROR';
            for (const bet of response.data.bets) {
                if (bet.errors !== undefined && bet.errors.length > 0) {
                    const idNum = parseInt(bet.id, 10);
                    if (!isNaN(idNum)) {
                        this.legsState.onUpdateError(idNum, bet.errors);
                    }
                }
            }
        }
        if (response !== null && response.status === 'error' && response.data === undefined) {
            this.placeBetStatus = 'ERROR';

            const debug = response.debug ?? null;
            if (typeof debug === 'string') {
                this.setPlaceBetErrorMsg('INTERNAL_SERVER_ERROR_MESSAGE');
            } else {
                const errors = debug !== null ? debug.errors : [];
                const firstError = errors[0] ?? null;
                const firstErrorCode = firstError !== null ? firstError.code : null;
                for (const error of errors) {
                    if (firstErrorCode === 'bet-stake-too-high') {
                        if (error.code === 'bet-stake-too-high' && error.details !== undefined && error.details?.maxStakePerLine !== undefined && error.details.maxStakePerLine > 0) {
                            this.betTooHighValue = error.details.maxStakePerLine;
                            this.setPlaceBetErrorMsg('BET-TOO-HIGH');
                        } else if (error.code === 'bet-stake-too-high' && error.details !== undefined && error.details?.maxStakePerLine !== undefined && error.details.maxStakePerLine === 0) {
                            this.betTooHighValue = error.details.maxStakePerLine;
                            this.setPlaceBetErrorMsg('MAX-BET-EXCEEDED');
                        } else if (error.code === 'bet-stake-too-high') {
                            this.betTooHighValue = null;
                            this.setPlaceBetErrorMsg('BET-TOO-HIGH');
                        }
                        if (error.code === 'bet-exceeds-max-payout') {
                            this.setPlaceBetErrorMsg('PAYOUT-TOO-HIGH');
                        }
                    }
                    if (error.code === 'minimum') {
                        this.setPlaceBetErrorMsg('BET-TOO-LOW');
                    }
                }
            }
        }
    }

    @action public clearError = (): void => {
        this.betTooHighValue = null;
        this.responseErrorMsgInner = new Set();
    }
    @action private setPlaceBetErrorMsg = (errorMsg: ErrorMsgType): void => {
        this.responseErrorMsgInner.add(errorMsg);
    }

    @computed public get responseErrorMsg(): Array<ErrorMsgType> {
        return Array.from(this.responseErrorMsgInner);
    }

    @action public onPlaceBetSuccess = (bets: Array<SuccessPlaceBetResponseType>): void => {

        this.onCleanAll();

        if (bets.length > 0) {
            let totalStake: number = 0;
            let totalPotentialReturns: number | null = 0;
            const fromFreeBets = this.freeBetsAmount !== null && this.freeBetsAmount > 0 && this.possibleBetsRequestState.fromFreeBets;
            const isFreeBet: boolean = fromFreeBets ? fromFreeBets : bets.some(bet => bet.freebet);
            const isSp = bets.some(bet => (
                bet.legs.some(leg => leg.priceType === 'sp')
            ));

            bets.forEach(bet => totalStake += bet.totalStake);

            if (isSp) {
                totalPotentialReturns = null;
            } else {
                for (const bet of bets) {
                    totalPotentialReturns += bet.potentialReturns ?? 0;
                }
            }

            const betsDetails: Array<BetDetailsLegsType> = [];
            for (const bet of bets) {
                if (bet.type === 'SGL') {
                    const firstLeg = bet.legs[0] ?? null;
                    if (firstLeg !== null) {
                        betsDetails.push({
                            potentialReturns: bet.potentialReturns ?? null,
                            stake: bet.stakePerLine,
                            betId: bet.id,
                            priceBet: firstLeg.price?.f ?? null,
                            eventName: firstLeg.event.name ?? 'Event name',
                            marketName: firstLeg.market !== undefined ? firstLeg.market.name : 'Market name',
                            selectionName:  firstLeg.selection !== undefined ? firstLeg.selection.name : 'Selection name',
                        });
                    }
                }
            }

            this.betReceiptSummary = {
                totalStake: totalStake ?? 0,
                totalPotentialReturns: totalPotentialReturns  ?? 0,
                isFreeBet: isFreeBet,
                details: {
                    legs: betsDetails,
                }
            };
        } else {
            this.betReceiptSummary = null;
        }

        if (this.basicBetSlipState.channel === 'quickbet' || this.configState.config.betslipReceiptClose) {
            setTimeout(() => {
                this.betReceiptSummary = null;
                if (this.possibleBetsRequestState.fromFreeBets) {
                    this.possibleBetsRequestState.onChangeFreeBetOption();
                }
            }, 3000);
        }
    }

    @action public onClearMessage = (): void => {
        this.betReceiptSummary = null;
    };

    @computed public get totalStakeRab(): number {
        return this.possibleBetsRequestState.coreRabPossibleBetsResponse.length > 0 ? this.possibleBetsRequestState.coreRabPossibleBetsResponse.reduce((acc, cur) => {
            if (cur.stakePerLine !== undefined){
                return acc + cur?.stakePerLine;
            }
            return acc;

        }, 0) : 0;
    }

    @computed public get payoutRab(): number {
        return this.possibleBetsRequestState.coreRabPossibleBetsResponse.length > 0 ? this.possibleBetsRequestState.coreRabPossibleBetsResponse.reduce((acc, cur) => {
            return cur.payout !== null && cur.payout !== undefined ? acc + cur.payout : acc + 0;
        }, 0) : 0;
    }

    @computed public get totalStake(): number {
        let everyPossibleBet = [];
        everyPossibleBet = this.possibleBetsRequestState.castBets;

        let totalStake = 0;

        for (const bet of everyPossibleBet) {
            let multiplier = (bet.eachWay !== null && bet.eachWay === true) ? 2 : 1;
            multiplier *= bet.numLines !== null ? bet.numLines : 1;
            totalStake += multiplier * (bet.stakePerLine !== null ? bet.stakePerLine : 0);
        }

        return totalStake + this.totalStakeRab;
    }

    @computed public get potentialReturn(): number | null {
            const potentialReturnCombinations = this.combinationState.forPotentialReturn;
            const potentialReturnLegs = this.legsState.forPotentialReturn;

            return potentialReturnCombinations + potentialReturnLegs + this.payoutRab;
    }

    @computed public get tax(): number {

        const taxCombinations = this.combinationState.forTax;
        const taxLegs = this.legsState.forTax;

        return taxCombinations + taxLegs;
    }

    @computed public get requiredToBetAmount(): number | null {
        if (this.basicBetSlipState.betSlipPlayableBalanceAmounts !== null) {
            const { requiredAmount, currentAmount } = this.basicBetSlipState.betSlipPlayableBalanceAmounts;
            if (requiredAmount !== null && requiredAmount !== undefined && currentAmount !== null && currentAmount !== undefined) {
                return requiredAmount - currentAmount;
            }
        }
        return null;
    }

    @computed public get isPlayableBalanceWarning(): boolean {
        return this.requiredToBetAmount !== null;
    }

    @computed public get isSinglesOnlyWarning(): boolean {
        return this.basicBetSlipState.betSlipSinglesOnly;
    }

    @computed public get isLegsChangedWarning(): boolean {
        let anyLegChanged = false;
        let anyRabLegChanged = false;
        const legsIds = this.getLegsIds();

        for (const legId of legsIds) {
            const leg = this.getLegItemById(legId);
            if (leg !== null) {
                if (anyLegChanged === false) {
                    anyLegChanged = leg.selectionChanged && (this.basicBetSlipState.placeBetStatus === null || this.basicBetSlipState.placeBetStatus !== 'IN_PROGRESS');
                }
            }
        }
        return anyLegChanged || anyRabLegChanged;
    }

    @computed public get isDisabledBettingButton(): boolean {
        //todo - hot fix do it better
        const errors = [];
        for (const err of this.basicBetSlipState.errors) {
            const shouldPlaceFreebet = err.code === 'minimum' && this.castBetsState.isFreeBetExceedsAmount === false && this.possibleBetsRequestState.fromFreeBets === true;

            if (shouldPlaceFreebet) {
                //allow place
            } else {
                errors.push(err);
            }
        }

        return this.isLegsChangedWarning ||
        errors.length > 0 ||
        this.totalStake === 0  ||
        this.legsState.isError ||
        this.combinationState.isError;
    }

    @computed public get betReceipt(): BetReceiptType | null {
        return this.betReceiptSummary;
    }

    @computed public get balanceAfter(): number {
        const { balance } = this.basicBetSlipState.userData;
        return balance !== null ? balance - this.totalStake : 0;
    }
}
