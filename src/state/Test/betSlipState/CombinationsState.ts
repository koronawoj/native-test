import { computed, action } from 'mobx';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { CombinationsRequestType } from 'src/state/Test/betSlipState/betting/getPossibleBetsTypes';
import { CombinationsType, CastBetType } from './BetSlipTypes';
import { MobxMapAutoNew } from 'src/state/Test/utils/MobxMapAutoNew';
import { CombinationItem } from './CombinationItem';
import { ModelsState } from 'src/state/Test/websocket2/ModelsState';

export class CombinationState {
    private readonly models: ModelsState;
    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    private readonly setMapCorePrepareCombinations: (betId: string, legModel: CombinationsRequestType) => void;
    private readonly deleteMapCorePrepareCombinations: () => void;

    public forViewCombinationsItemMap: MobxMapAutoNew<string, CombinationItem>;

    public constructor(models: ModelsState, possibleBetsRequestState: PossibleBetsRequestState, setMapCorePrepareCombinations: (betId: string, legModel: CombinationsRequestType) => void, deleteMapCorePrepareCombinations: () => void) {
        this.models = models;
        this.possibleBetsRequestState = possibleBetsRequestState;
        this.setMapCorePrepareCombinations = setMapCorePrepareCombinations;
        this.deleteMapCorePrepareCombinations = deleteMapCorePrepareCombinations;

        this.forViewCombinationsItemMap = new MobxMapAutoNew((combinationType: string) => {
            return new CombinationItem(() => this.getCombinationById(combinationType), this.onChangeCombinationStake, this.onChangeEachWayCombination);
        });
    }

    private getCombinationById = (combinationType: string): CombinationsType | null => {
        return this.possibleBetsRequestState.combinationsForViewMap.get(combinationType) ?? null;
    }

    @action public cleanCombinations = (): void => {
        this.deleteMapCorePrepareCombinations();
    }

    @action private onChangeCombinationStake = (combinationType: string, stakeValue: number): void => {

        const combinationItem = this.possibleBetsRequestState.mapCorePrepareCombinationsFromResponse.get(combinationType);

        if (combinationItem !== undefined && combinationItem.type === combinationType) {

            const changedCombinationItem = {
                ...combinationItem,
                stakePerLine: stakeValue
            };

            this.setMapCorePrepareCombinations(combinationType, changedCombinationItem);
        }
    }

    @action private onChangeEachWayCombination = (combinationType: string, checked: boolean): void => {
        const combinationItem = this.possibleBetsRequestState.mapCorePrepareCombinationsFromResponse.get(combinationType);

        if (combinationItem !== undefined && combinationItem.type === combinationType) {

            const changedCombinationItem = {
                ...combinationItem,
                eachWay: checked
            };

            this.setMapCorePrepareCombinations(combinationType, changedCombinationItem);
        }
    }

    @computed private get combinationsForViewArr(): Array<CombinationsType> {
        return Array.from(this.possibleBetsRequestState.combinationsForViewMap.values());
    }

    @computed private get castCombinationsPossibleBetsResponse(): Array<CastBetType> {

        const preparedCasts: Array<CastBetType> = [];

        if (this.possibleBetsRequestState.coreCombinationsPossibleBetsResponse !== null) {
            for (const cast of this.possibleBetsRequestState.coreLegsPossibleBetsResponse) {
                if (cast.type !== 'SGL' && cast.type !== 'RAB' && cast.stakePerLine > 0) {
                    const combination = this.possibleBetsRequestState.coreCombinationsPossibleBetsResponse[cast.type] ?? null;

                    const legs = combination !== null ? combination.legs.map(leg => {
                        const selectionId = leg.selection?.id ?? null;
                        const marketId = leg.market?.id ?? null;
                        if (selectionId === null || marketId === null) {
                            return leg;
                        }
                        const selection = this.models.getSelectionAndLoad(marketId, selectionId);
                        return {
                            ...leg,
                            uuid: selection?.uuid ?? null
                        };
                    }) : [];

                    const tempCast: CastBetType = {
                        channel: cast.channel,
                        correlationId: cast.correlationId ?? null,
                        country: cast.country,
                        currency: cast.currency,
                        eachWay: cast.eachWay,
                        freebetCredits: null,
                        freebetRemarks: null,
                        id: cast.id,
                        ip: cast.ip,
                        legs: legs,
                        maxStake: cast.maxStake ?? null,
                        potentialReturns: cast.potentialReturns ?? null,
                        potentialReturnsEw: cast.potentialReturnsEw ?? null,
                        totalStake: cast.totalStake ?? null,
                        tax: cast.tax ?? null,
                        price: cast.price,
                        stakePerLine: cast.stakePerLine,
                        type: cast.type,
                        numLines: combination !== null ? combination.numLines ?? 1 : 1,
                        errors: cast.errors ?? []
                    };
                    preparedCasts.push(tempCast);
                }
            }
        }

        return preparedCasts;
    }

    @computed public get forPotentialReturn(): number {
        let totalPotentialReturn: number = 0;
        for (const combination of this.combinationsForViewArr) {

            if (combination.potentialReturns !== null && combination.stakePerLine !== null && combination.stakePerLine > 0) {
                totalPotentialReturn = totalPotentialReturn + combination.potentialReturns;
            }
        }
        return totalPotentialReturn;
    }

    @computed public get forTax(): number {
        let tax: number = 0;
        for (const combination of this.combinationsForViewArr) {

            if (combination.tax !== null && combination.stakePerLine !== null && combination.stakePerLine > 0) {
                tax += combination.tax;
            }
        }
        return tax;
    }

    @computed public get forPlaceBet(): Array<CastBetType> {
        const forPlaceBet: Array<CastBetType> = [];
        for (const combination of this.castCombinationsPossibleBetsResponse) {
            forPlaceBet.push(combination);
        }

        return forPlaceBet;
    }

    @computed public get isError(): boolean {
        return this.castCombinationsPossibleBetsResponse.some(elem => {
            return elem.errors.length > 0;
        });
    }
}
