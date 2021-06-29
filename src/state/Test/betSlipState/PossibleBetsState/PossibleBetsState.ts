import { getPossibleBetsNew } from 'src/state/Test/betSlipState/betting/getPossibleBets';
import { computed, observable, action, toJS } from 'mobx';
import { Resource } from 'src/state/Test/utils/Resource';
import { ParsedPossibleBetsType, BettingPossibleBetsType, CombinationsRequestType, LegCombinationsForRequestType, GetPossibleBetsLegsRequestType, PlayableBalanceAmountsType, BetResponseExtendedType, BetResponseType, ParsedCombinationsType, ErrorRawType, AccountDataTypes, GetPossibleBetsRequestNewType, BetsForRequestType, SmallLegStrictWithEachWayType, RabRawType } from 'src/state/Test/betSlipState/betting/getPossibleBetsTypes';
import { LegType, CombinationsType } from 'src/state/Test/betSlipState/BetSlipTypes';
import { ModelsState } from 'src/state/Test/websocket2/ModelsState';
import { ForTotalStakeTypes, BetSlipUserDataType } from 'src/state/Test/betSlipState/BetSlipSheredTypes';
import * as uuid from 'uuid';

export class PossibleBetsRequestState {
    private readonly models: ModelsState;

    private readonly getFreeBetsAmount: () => number | null;
    private readonly getMapCorePrepareLegs: () => Map<number, GetPossibleBetsLegsRequestType>;
    private readonly getCoreCombinationsPossibleBetsRequest: () => Record<string, CombinationsRequestType> | null;
    private readonly getAccountData: () => BetSlipUserDataType;

    public prevCorePossibleBetsResponse: ParsedPossibleBetsType | null;

    @observable public fromFreeBets: boolean;

    public constructor(models: ModelsState, getFreeBetsAmount: () => number | null, getMapCorePrepareLegs: () => Map<number, GetPossibleBetsLegsRequestType>, getCoreCombinationsPossibleBetsRequest:() => Record<string, CombinationsRequestType> | null, getAccountData: () => BetSlipUserDataType) {
        this.models = models;
        this.getFreeBetsAmount = getFreeBetsAmount;
        this.getMapCorePrepareLegs = getMapCorePrepareLegs;
        this.getCoreCombinationsPossibleBetsRequest = getCoreCombinationsPossibleBetsRequest;
        this.getAccountData = getAccountData;
        this.prevCorePossibleBetsResponse = null;
        this.fromFreeBets = false;
    }

    @action public onChangeFreeBetOption = (): void => {
        this.fromFreeBets = !this.fromFreeBets;
    }

    @action public setFreeBetOption = (value: boolean): void => {
        this.fromFreeBets = value;
    }

    @computed private get freeBetsAmount(): number | null {
        return this.getFreeBetsAmount();
    }

    @computed private get mapCorePrepareLegs(): Map<number, GetPossibleBetsLegsRequestType> {
        return this.getMapCorePrepareLegs();
    }

    @computed public get coreLegsPossibleBetsRequest(): Array<GetPossibleBetsLegsRequestType> {
        return Array.from(this.mapCorePrepareLegs.values());
    }

    @computed private get coreCombinationsPossibleBetsRequest(): Record<string, CombinationsRequestType> | null{
        return this.getCoreCombinationsPossibleBetsRequest();
    }

    @computed private get coreLegsPossibleBetsRequestParsedArr(): Array<ForTotalStakeTypes> {
        return this.coreLegsPossibleBetsRequest.map(elem => {
            return {
                ...elem,
                numLines: null
            };
        });
    }

    @computed private get coreCombinationsPossibleBetsRequestParsedArr(): Array<ForTotalStakeTypes>{
        if (this.coreCombinationsPossibleBetsRequest !== null) {
            return Object.values(this.coreCombinationsPossibleBetsRequest);
        }
        return [];
    }

    @computed private get totalStakeBefore(): number {
        let totalStake = 0;

        for (const bet of [...this.coreLegsPossibleBetsRequestParsedArr, ...this.coreCombinationsPossibleBetsRequestParsedArr]) {
            //if (bet !== null) {
            let multiplier = (bet.eachWay !== null && bet.eachWay === true) ? 2 : 1;
            multiplier *= bet.numLines !== null ? bet.numLines : 1;
            totalStake += multiplier * (bet.stakePerLine !== null ? bet.stakePerLine : 0);
            //}
        }

        return totalStake;
    }
    // do not remove for now
    // @computed private get isAllowFreeBet(): boolean {
    //     const isAllowFreeBet = this.freeBetsAmount;
    //     if(isAllowFreeBet !== null) {
    //         return isAllowFreeBet > 0 && isAllowFreeBet > this.totalStakeBefore;
    //     }
    //     // return true;
    //     return true;
    // }

    @computed public get isFromFreeBets(): boolean {
        const isAllowFreeBet = this.freeBetsAmount;
        if (isAllowFreeBet !== null) {
            return this.fromFreeBets && isAllowFreeBet > this.totalStakeBefore;
        }
        return false;
    }

    @computed private get justPossibleBetsResponse(): Resource<BettingPossibleBetsType> {
        const requestDataNew = this.corePossibleBetsRequestNew;
        return new Resource(async (): Promise<BettingPossibleBetsType> => getPossibleBetsNew(requestDataNew));
    }

    @computed private get corePossibleBetsResponse(): ParsedPossibleBetsType | null {
        const rabBets = this.corePossibleBetsRequestNew.rabBets ?? [];

        if (this.corePossibleBetsRequestNew.bets.length === 0 && rabBets.length === 0) {
            return this.prevCorePossibleBetsResponse;
        }

        const corePossibleBetsResponse = this.justPossibleBetsResponse.get();
        if (corePossibleBetsResponse.type === 'ready') {
            const response = corePossibleBetsResponse.value;
            if (response !== null && response.status === 'error') {
                if (this.prevCorePossibleBetsResponse !== null) {
                    const error: ErrorRawType = {
                        code: 'INTERNAL_SERVER_ERROR_MESSAGE',
                        debugDetails: 'Server error',
                        details: null,
                        field: null,
                        pointer: null,
                        resource: 'Server',
                        leg: null,

                    };

                    const response = {
                        ...this.prevCorePossibleBetsResponse,
                        errors: [error],
                    };
                    return response;
                }
                return this.prevCorePossibleBetsResponse;
            }
            if (response !== null && response.status === 'success') {
                this.prevCorePossibleBetsResponse = response.data;
                return response.data;
            }
        }
        return this.prevCorePossibleBetsResponse;
    }

    @computed public get coreRabPossibleBetsResponse(): Array<RabRawType> {
        if (this.corePossibleBetsResponse !== null /*&& this.corePossibleBetsResponse !== undefined*/)  {
            return this.corePossibleBetsResponse.rabBets ?? [];
        }
        return [];
    }

    @computed public get coreLegsPossibleBetsResponse(): Array<BetResponseType> {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.bets;
        }
        return [];
    }

    @computed public get parsedLegsPossibleBetsResponse(): Array<LegType> {
        const preparedLegs: Array<LegType> = [];
        for (const leg of this.coreLegsPossibleBetsResponse) {
            const selectionId = parseInt(leg.id, 10);
            const selectionModel = isNaN(selectionId) ? null : this.models.getSelection(selectionId);
            if (selectionModel !== null && leg.type === 'SGL') {

                const firstLeg = leg.legs[0];

                preparedLegs.push({
                    eachWay: leg.eachWay,
                    errors: leg.errors ?? [],
                    eventId: selectionModel.eventId,
                    freebetCredits: leg.freebetCredits ?? null,
                    freebetRemarks: leg.freebetRemarks ?? null,
                    marketId: selectionModel.marketId,
                    maxStake: leg.maxStake ?? null,
                    potentialReturns: leg.potentialReturns ?? 0,
                    potentialReturnsAt: leg.potentialReturnsEw ?? 0,
                    potentialReturnsEw: leg.potentialReturnsEw ?? 0,
                    price: selectionModel.price ?? null,
                    priceType: firstLeg !== undefined ? firstLeg.priceType ?? 'fp' : 'fp',
                    related: this.marketsWithRelatedSelections.includes(selectionModel.marketId),
                    selectionId: selectionModel.id,
                    index: selectionModel.id,
                    stakePerLine: leg.stakePerLine,
                    timestamp: 0,
                    numLines: 1,
                    totalStake: leg.totalStake,
                    tax: leg.tax ?? null,
                    uuid: selectionModel.uuid,
                });
            }
        }

        return preparedLegs;
    }

    @computed public get legsPossibleBetsResponseMap(): Map<number, LegType> {
        const legsMap: Map<number, LegType> = new Map();
        for (const leg of this.parsedLegsPossibleBetsResponse) {
            if (leg.selectionId !== null) {
                legsMap.set(leg.selectionId, leg);
            }
        }

        return legsMap;
    }

    @computed public get coreCombinationsPossibleBetsResponse(): Record<string, ParsedCombinationsType> | null {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.combinations;
        }
        return null;
    }

    @computed private get castCompetitions(): Map<string, BetResponseType> {
        const tempMap: Map<string, BetResponseType> = new Map();
        for (const cast of this.coreLegsPossibleBetsResponse) {
            if (cast.type !== 'SGL') {
                tempMap.set(cast.type, cast);
            }
        }
        return tempMap;
    }

    @computed public get combinationsForViewMap(): Map<string, CombinationsType> {
        const tempMap: Map<string, CombinationsType> = new Map();
        if (this.coreCombinationsPossibleBetsResponse !== null) {
            for (const combination of Object.values(this.coreCombinationsPossibleBetsResponse)) {
                const cast = this.castCompetitions.get(combination.type);
                const simpleCombinationModel = {
                    errors: combination.errors ?? null,
                    eachWay: false,
                    ewOffered: combination.ewOffered,
                    freebetCredits: combination.freebetCredits ?? [],
                    freebetRemarks: combination.freebetRemarks ?? [],
                    legs: combination.legs ?? [],
                    maxStake: combination.maxStake ?? null,
                    name: combination.name,
                    numLines: combination.numLines,
                    potentialReturns: combination.potentialReturns,
                    potentialReturnsAt: combination.potentialReturnsAt ?? null,
                    potentialReturnsEw: combination.potentialReturnsEw ?? null,
                    price: combination.price ?? null,
                    stakePerLine: 0,
                    totalStake: 0,
                    type: combination.type,
                    tax: null,
                };
                const castCombinationModel = cast !== undefined ? {
                    errors: cast.errors ?? [],
                    eachWay: cast.eachWay,
                    freebetCredits: cast.freebetCredits ?? [],
                    freebetRemarks: cast.freebetRemarks ?? [],
                    legs: cast.legs ?? [],
                    maxStake: cast.maxStake ?? null,
                    potentialReturns: cast.potentialReturns ?? null,
                    potentialReturnsEw: cast.potentialReturnsEw ?? null,
                    price: cast.price,
                    stakePerLine: cast.stakePerLine,
                    totalStake: cast.totalStake ?? null,
                    type: cast.type,
                    tax: cast.tax ?? null,
                } : {};

                const combinationModel: CombinationsType = {
                    ...simpleCombinationModel,
                    ...castCombinationModel
                };

                tempMap.set(combination.type, combinationModel);
            }
        }

        return tempMap;
    }

    @computed public get mapCorePrepareCombinationsFromResponse(): Map<string, CombinationsRequestType> {
        const mapCorePrepareCombinations: Map<string, CombinationsRequestType> = new Map();

        for (const combination of Array.from(this.combinationsForViewMap.values())) {
            if (combination.type !== 'SGL') {
                const tempCombination: CombinationsRequestType = {
                    legs: combination.legs ?? [],
                    potentialReturns: combination.potentialReturns ?? 0,
                    price: combination.price,
                    ewOffered: combination.ewOffered,
                    name: combination.name,
                    maxStake: combination.maxStake ?? null,
                    stakePerLine: combination.stakePerLine ?? 0,
                    potentialReturnsEw: combination.potentialReturnsEw ?? null,
                    potentialReturnsAt: combination.potentialReturnsEw ?? null,
                    numLines: combination.numLines,
                    type: combination.type,
                    eachWay: combination.eachWay ?? false,
                    freebetCredits: combination.freebetCredits ?? [],
                    freebetRemarks: combination.freebetRemarks ?? [],
                };
                mapCorePrepareCombinations.set(combination.type, tempCombination);
            }
        }
        return mapCorePrepareCombinations;
    }


    @computed public get castBets(): Array<BetResponseExtendedType> {
        if (this.corePossibleBetsResponse !== null) {
            const castBets: Array<BetResponseExtendedType> = [];
            for (const bet of this.corePossibleBetsResponse.bets) {
                if (bet.stakePerLine > 0) {
                    if (bet.type !== 'SGL') {
                        const combination = this.corePossibleBetsResponse.combinations[bet.type];
                        if (combination !== undefined) {
                            castBets.push({
                                ...bet,
                                numLines: combination.numLines
                            });
                        }
                    } else {
                        castBets.push({
                            ...bet,
                            numLines: 1
                        });
                    }
                }
            }

            return castBets;
        }
        return [];
    }

    @computed public get marketsWithRelatedSelections(): Array<number> {
        const helperArray: Array<number> = [];
        const tempSet: Set<number> = new Set();
        for (const leg of this.coreLegsPossibleBetsResponse) {
            const selectionId = parseInt(leg.id, 10);
            const selectionModel = isNaN(selectionId) ? null : this.models.getSelection(selectionId);
            if (selectionModel !== null) {
                if (helperArray.includes(selectionModel.marketId)) {
                    tempSet.add(selectionModel.marketId);
                }
                helperArray.push(selectionModel.marketId);
            }
        }
        return Array.from(tempSet);
    }

    @computed public get errors(): Array<ErrorRawType> {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.errors;
        }
        return [];
    }

    @computed public get playableBalanceAmounts(): PlayableBalanceAmountsType | null | undefined{
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.playableBalanceAmounts ?? null;
        }
        return null;
    }

    @computed public get isSinglesOnly(): boolean {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.singlesOnly;
        }
        return false;
    }

    @computed public get isLoading(): boolean {
        //if(this.justPossibleBetsResponse !== null) {
        const corePossibleBetsResponse = this.justPossibleBetsResponse.get();
        return corePossibleBetsResponse.type === 'loading';
        //}

        //return false;
    }

    @computed public get isRelated(): boolean {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.related;
        }
        return false;
    }

    @computed public get isRelatedOnAdd(): boolean {
        if (this.corePossibleBetsResponse !== null) {
            return this.corePossibleBetsResponse.relatedOnAdd;
        }
        return false;
    }




    // ------------------------------ new possible bets request


    @computed private get accountData(): AccountDataTypes {

        const accountData = this.getAccountData();
        const accountId = accountData.userId;

        return {
            currency: 'EUR',
            country: 'DE',
            id: accountId
        };
    }
    @computed private get corePossibleBetsRequestNew(): GetPossibleBetsRequestNewType {
        return {
            channel: 'desktop',
            rabBets: [],
            isFreeBet: true,
            isFreeBetTax: this.isFromFreeBets,
            accountData: this.accountData,
            bets: this.betsForRequest,
            legCombinations: this.legCombinationsForRequest
        };
    }

    @computed public get betsForRequest(): Array<BetsForRequestType> {


        const legs = this.coreLegsPossibleBetsRequest;
        const combinations = this.coreCombinationsPossibleBetsRequest ?? [];

        const bets: Array<BetsForRequestType> = [];
        const legCombinations = [];

        for (const leg of legs) {
            const selection = this.models.getSelection(leg.selectionId);
            const market = this.models.getMarket(leg.marketId);
            if (selection !== null && market !== null) {
                const bet: BetsForRequestType = {
                    id: leg.selectionId.toString(),
                    type: 'SGL',
                    stakePerLine: leg.stakePerLine,
                    payout: null,
                    eachWay: market.eachWay !== undefined ? Boolean(leg.eachWay) : Boolean(leg.eachWay),
                    legs: [
                        {
                            type: 'standard',
                            selection: { id: leg.selectionId },
                            market: { id: leg.marketId },
                            event: { id: leg.eventId },
                            price: selection.price,
                            priceType: selection.spOnly === true ? leg.priceType : leg.priceType,
                        }
                    ],
                    freebetCredits: toJS(leg.freebetCredits),
                    freebetRemarks: toJS(leg.freebetRemarks),
                    ip: '',
                    channel: '',
                    country: this.accountData.country,
                    currency: this.accountData.currency,
                    correlationId: uuid.v4(),
                    // price: leg.price ?? null,
                    // maxStake: leg.maxStake,
                    // potentialReturns: leg.potentialReturns,
                    // potentialReturnsEw: leg.potentialReturnsEw,
                    // tax: null,
                    // totalStake: null,
                    // errors: []
                };
                const combination = {
                    type: 'standard',
                    selection: { id: leg.selectionId },
                    market: { id: leg.marketId },
                    event: { id: leg.eventId },
                    price: selection.price,
                    priceType: leg.priceType
                };

                bets.push(bet);
                legCombinations.push(combination);
            }

        }

        for (const combination of Object.values(combinations)) {
            const bet: BetsForRequestType = {
                id: `all${combination.type}`,
                type: combination.type,
                freebetCredits: toJS(combination.freebetCredits),
                freebetRemarks: toJS(combination.freebetRemarks),
                stakePerLine: combination.stakePerLine,
                payout: null,
                eachWay: Boolean(combination.eachWay),
                legs: legCombinations,
                ip: '',
                channel: '',
                country: this.accountData.country,
                currency: this.accountData.currency,
                correlationId: uuid.v4(),
                // price: combination.price,
                // maxStake: combination.maxStake,
                // potentialReturns: combination.potentialReturns,
                // potentialReturnsEw: combination.potentialReturnsEw,
                // tax: null,
                // totalStake: null,
                // errors: []
            };

            bets.push(bet);
        }

        return bets;

    }

    @computed public get selectedBetsForRequest(): Array<SmallLegStrictWithEachWayType> {

        const selected = [];

        for ( const bet of this.betsForRequest ) {
            if (bet.type === 'SGL') {
                const leg = bet.legs.length > 0 ? bet.legs[0] : undefined;
                if (leg !== undefined) {
                    selected.push({
                        ...leg,
                        eachWay: bet.eachWay
                    });
                }
            }
        }

        return selected;
    }

    @computed public get legCombinationsForRequest(): Array<LegCombinationsForRequestType> {

        const legCombinations = this.selectedBetsForRequest.map(leg => {
            return {
                id: leg.selection !== undefined ? leg.selection.id.toString() : null,
                legs: [ leg ],
                eachWay: leg.eachWay
            };
        });

        legCombinations.push({
            id: 'combinations',
            legs: this.selectedBetsForRequest,
            eachWay: false
        });

        return legCombinations;
    }
}
