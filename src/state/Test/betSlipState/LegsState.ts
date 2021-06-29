import { action, computed, observable } from 'mobx';
import { LegType } from './BetSlipTypes';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { GetPossibleBetsLegsRequestType } from 'src/state/Test/betSlipState/betting/getPossibleBetsTypes';
import { ModelsState } from 'src/state/Test/websocket2/ModelsState';
import { MobxMapAutoNew } from 'src/state/Test/utils/MobxMapAutoNew';
import { LegItem } from './LegItem';
import { ErrorType } from './BetSlipSheredTypes';
import { AccountState } from 'src/state/Test/accountState/AccountState';

export class LegsState {
    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    private readonly models: ModelsState;
    private readonly getMapCorePrepareLegs: () => Map<number, GetPossibleBetsLegsRequestType>;
    private readonly addMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void;
    private readonly setMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void;
    private readonly deleteMapCorePrepareLegsItem: (betId: number) => void;
    public forViewLegsItemMap: MobxMapAutoNew<number, LegItem>;
    @observable public lastChangeDirection: 'up' | 'down' | null  = null;

    public constructor(
        models: ModelsState,
        possibleBetsRequestState: PossibleBetsRequestState,
        public readonly accountState: AccountState,
        getMapCorePrepareLegs: () => Map<number, GetPossibleBetsLegsRequestType>,
        addMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void,
        setMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void,
        deleteMapCorePrepareLegsItem: (betId: number) => void,
    ) {
        this.models = models;
        this.possibleBetsRequestState = possibleBetsRequestState;
        this.getMapCorePrepareLegs = getMapCorePrepareLegs;
        this.setMapCorePrepareLegs = setMapCorePrepareLegs;
        this.deleteMapCorePrepareLegsItem = deleteMapCorePrepareLegsItem;
        this.addMapCorePrepareLegs = addMapCorePrepareLegs;

        this.forViewLegsItemMap = new MobxMapAutoNew((selectionId: number) => {
            return new LegItem(() => this.getLegById(selectionId), this.accountState, this.models, this.onChangeLegStake, this.onRemoveLeg, this.onChangeEachWayLeg, this.onChangePriceType);
        });

    }

    public getLegById = (legId: number): LegType | null => {
        return this.parsedLegsMap.get(legId) ?? null;
    }

    @action private onRemoveLeg = (betId: number): void => {
        this.deleteMapCorePrepareLegsItem(betId);
    }

    @action public onAddSimpleBet = (betId: number): void => {
        const betItem = this.mapCorePrepareLegs.get(betId);
        if (betItem !== undefined) {
            if (betItem.priceType === 'sp') {
                this.onChangePriceType(betItem.id, 'fp');
            } else {
                this.deleteMapCorePrepareLegsItem(betId);
            }
        } else {
            this.justAddBet(betId, false, null);
        }
    }

    @action public onAddSPBet = (betId: number): void => {
        const betItem = this.mapCorePrepareLegs.get(betId);
        if (betItem !== undefined) {
            if (betItem.priceType === 'fp') {
                this.onChangePriceType(betItem.id, 'sp');
            } else {
                this.deleteMapCorePrepareLegsItem(betId);
            }
        } else {
            this.justAddBet(betId, true, null);
        }
    }

    @action public onAddCastBet = (betId: number, index: number, sp: boolean,): void => {
        const betItem = this.mapCorePrepareLegs.get(betId);
        if (betItem !== undefined) {
            this.deleteMapCorePrepareLegsItem(betId);
        } else {
            this.justAddBet(betId, sp, index);
        }
    }


    @action private justAddBet = (betId: number, sp: boolean, index: number | null): void => {
        const selectionModel = this.models.getSelection(betId);

        if (selectionModel !== null) {
            const selectionSuspended = selectionModel.forView(sp)?.suspended ?? false;
            const isReferred = false;

            if (selectionSuspended === false && isReferred === false) {
                const coreLegsPossibleBetsRequestItem: GetPossibleBetsLegsRequestType = {
                    eventId: selectionModel.eventId,
                    marketId: selectionModel.marketId,
                    selectionId: betId,
                    priceType: selectionModel.spOnly === true || sp === true ? 'sp' : 'fp',
                    timestamp: Date.now(),
                    stakePerLine: 0,
                    potentialReturns: 0,
                    related: false,
                    errors: [],
                    eachWay: false,
                    freebetRemarks: [],
                    freebetCredits: [],
                    maxStake: 0,
                    potentialReturnsAt: 0,
                    id: selectionModel.id,
                    oldPrice: null,
                    name: '',
                    potentialReturnsEw: 0,
                    type: selectionModel.isSP ? 'sp' : 'fp',
                    index: index ?? null,
                    price: null,
                };

                this.addMapCorePrepareLegs(betId, coreLegsPossibleBetsRequestItem);
            }
        }
    }

    /**
     * @deprecated use onAddSimpleBet or onAddSPBet or onAddCastBet
     */
    @action public onAddBet = (betId: number, index: number | null, sp: boolean): void => {

        const betItem = this.mapCorePrepareLegs.get(betId);
        if (betItem !== undefined) {

            if (sp && betItem.priceType !== 'sp') {
                this.onChangePriceType(betItem.id, 'sp');
            } else {
                this.deleteMapCorePrepareLegsItem(betId);
            }
        } else {
            const selectionModel = this.models.getSelection(betId);
            
            if (selectionModel !== null) {
                const selectionSuspended = selectionModel.forView(sp)?.suspended ?? false;
                const isReferred = false;

                if (selectionSuspended === false && isReferred === false) {
                    const coreLegsPossibleBetsRequestItem: GetPossibleBetsLegsRequestType = {
                        eventId: selectionModel.eventId,
                        marketId: selectionModel.marketId,
                        selectionId: betId,
                        priceType: selectionModel.spOnly === true || sp === true ? 'sp' : 'fp',
                        timestamp: Date.now(),
                        stakePerLine: 0,
                        potentialReturns: 0,
                        related: false,
                        errors: [],
                        eachWay: false,
                        freebetRemarks: [],
                        freebetCredits: [],
                        maxStake: 0,
                        potentialReturnsAt: 0,
                        id: selectionModel.id,
                        oldPrice: null,
                        name: '',
                        potentialReturnsEw: 0,
                        type: selectionModel.isSP ? 'sp' : 'fp',
                        index: index ?? null,
                        price: null,
                    };
    
                    this.addMapCorePrepareLegs(betId, coreLegsPossibleBetsRequestItem);
                }

            }
        }

    }

    @action private onChangeLegStake = (betId: number, stakeValue: number): void => {
        const legItem = this.mapCorePrepareLegs.get(betId);
        if (legItem !== undefined && betId === legItem.selectionId) {
            const changedLegItem = {
                ...legItem,
                stakePerLine: stakeValue
            };

            this.setMapCorePrepareLegs(betId, changedLegItem);
        }
    }

    @action private onChangeEachWayLeg = (betId: number, checked: boolean): void => {
        const legItem = this.mapCorePrepareLegs.get(betId);
        if (legItem !== undefined && betId === legItem.selectionId) {
            const changedLegItem = {
                ...legItem,
                eachWay: checked
            };

            this.setMapCorePrepareLegs(betId, changedLegItem);
        }
    }

    @action private onChangePriceType = (betId: number, price: string): void => {
        const legItem = this.mapCorePrepareLegs.get(betId);
        if (legItem !== undefined && betId === legItem.selectionId && (price === 'sp' || price === 'fp')) {
            const changedLegItem = {
                ...legItem,
                priceType: price
            };
            this.setMapCorePrepareLegs(betId, changedLegItem);
        }
    }

    @action public onUpdateError = (betId: number, errors: Array<ErrorType>): void => {
        const legItem = this.mapCorePrepareLegs.get(betId);
        if (legItem !== undefined && betId === legItem.selectionId) {
            const changedLegItem = {
                ...legItem,
                errors: errors
            };

            this.setMapCorePrepareLegs(betId, changedLegItem);
        }
    }

    @action public onAcceptLegsChanges = (): void => {
        for (const legId of this.legsIds) {
            const leg = this.forViewLegsItemMap.get(legId);
            leg.acceptChanges();
            this.lastChangeDirection = null;
            const legItem = this.mapCorePrepareLegs.get(legId);
            if (legItem !== undefined && legId === legItem.selectionId) {
                const changedLegItem: GetPossibleBetsLegsRequestType = {
                    ...legItem,
                    potentialReturns: 0,
                    potentialReturnsAt: 0,
                    potentialReturnsEw: 0,
                };

                this.setMapCorePrepareLegs(legId, changedLegItem);
            }
        }
    }

    @computed private get mapCorePrepareLegs():Map<number, GetPossibleBetsLegsRequestType> {
        return this.getMapCorePrepareLegs();
    }

    @computed private get beforeRequestParsedLegs(): Array<LegType> {
        const preparedLegs: Array<LegType> = [];
        for (const leg of Array.from(this.mapCorePrepareLegs.values())) {
            const selectionId = leg.id;
            const selectionModel = this.models.getSelection(selectionId);
            if (selectionModel !== null) {
                preparedLegs.push({
                    eachWay: leg.eachWay,
                    errors: leg.errors ?? [],
                    eventId: selectionModel.eventId,
                    freebetCredits: null,
                    freebetRemarks: null,
                    marketId: selectionModel.marketId,
                    maxStake: leg.maxStake,
                    potentialReturns: leg.potentialReturns ?? 0,
                    potentialReturnsAt: leg.potentialReturnsEw ?? 0,
                    potentialReturnsEw: leg.potentialReturnsEw ?? 0,
                    price: selectionModel.price ?? null,
                    priceType: leg.priceType,
                    related: false,
                    selectionId: selectionModel.id,
                    index: selectionModel.id,
                    stakePerLine: leg.stakePerLine,
                    timestamp: 0,
                    numLines: 1,
                    totalStake: null,
                    tax: null,
                    uuid: selectionModel.uuid
                });
            }
        }

        return preparedLegs;
    }

    @computed private get parsedLegs(): Array<LegType> {
        return this.beforeRequestParsedLegs.map(leg => {
            const responseLeg = leg.selectionId !== null ? this.possibleBetsRequestState.legsPossibleBetsResponseMap.get(leg.selectionId) : undefined;
            if (responseLeg !== undefined) {
                return {
                    ...leg,
                    ...responseLeg
                };
            } else {
                return {
                    ...leg,
                };
            }
        });
    }

    @computed private get legsIds(): Array<number> {
        return this.coreLegsPossibleBetsRequest.map((bet) => bet.selectionId);
    }

    @computed.struct public get coreLegsPossibleBetsRequest(): Array<GetPossibleBetsLegsRequestType> {
        return Array.from(this.mapCorePrepareLegs.values());
    }

    @computed private get parsedLegsMap(): Map<number, LegType> {
        const legsMap: Map<number, LegType> = new Map();
        for (const leg of this.parsedLegs) {
            if (leg.selectionId !== null) {
                legsMap.set(leg.selectionId, leg);
            }
        }

        return legsMap;
    }

    @computed public get forPotentialReturn(): number {
        let totalPotentialReturn: number = 0;
        for (const leg of this.possibleBetsRequestState.parsedLegsPossibleBetsResponse) {

            if (leg.potentialReturns !== null && leg.stakePerLine !== undefined && leg.stakePerLine !== null && leg.stakePerLine > 0) {
                totalPotentialReturn = totalPotentialReturn + leg.potentialReturns;
            }
        }
        return totalPotentialReturn;
    }

    @computed public get forTax(): number {
        let tax: number = 0;

        for (const leg of this.possibleBetsRequestState.parsedLegsPossibleBetsResponse) {

            if (leg.tax !== null && leg.stakePerLine !== undefined && leg.stakePerLine !== null && leg.stakePerLine > 0) {
                tax += leg.tax;
            }
        }
        return tax;
    }

    @computed public get forPlaceBet(): Array<LegType> {
        const forPlaceBet: Array<LegType> = [];
        for (const leg of this.possibleBetsRequestState.parsedLegsPossibleBetsResponse) {
            if (leg.stakePerLine !== null) {
                forPlaceBet.push(leg);
            }
        }

        return forPlaceBet;
    }

    @computed public get isError(): boolean {
        return this.possibleBetsRequestState.parsedLegsPossibleBetsResponse.some(elem => {
            return elem.errors.length > 0;
        });
    }

    @computed public get isAnyLegSP(): boolean {
        return this.possibleBetsRequestState.parsedLegsPossibleBetsResponse.some(elem => {
            return elem.priceType === 'sp';
        });
    }

    @action public isLegChanged = (legId: number): boolean => {
        let legChanged = false;
        const leg = this.forViewLegsItemMap.get(legId);
        if (legChanged === false) {
            legChanged = leg.selectionChanged;
        }

        return legChanged;
    }
}
