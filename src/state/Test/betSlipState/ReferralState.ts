
import { computed, observable, action } from 'mobx';
import { LegType, CombinationsType, decodeReferralType, ReferralTypeModel, ReferralCombinationType, ReferralLegType } from './BetSlipTypes';
import { MobxValue } from '@twoupdigital/mobx-utils/libjs/MobxValue';
import { postRejectOffer } from 'src/state/Test/betSlipState/betting/postRejectOffer';
import { postAcceptOffer } from 'src/state/Test/betSlipState/betting/postAcceptOffer';
import { mapOfferBets } from 'src/state/Test/betSlipState/betting/parse';
import moment from 'moment';
import { LegItem } from './LegItem';
import { CombinationItem } from './CombinationItem';
import { CombinationsRequestType, GetPossibleBetsLegsRequestType } from 'src/state/Test/betSlipState/betting/getPossibleBetsTypes';
import { MobxMapAutoNew } from '@twoupdigital/mobx-utils/libjs/MobxMapAutoNew';
import { Resource } from '@twoupdigital/mobx-utils/libjs/Resource';
import { ParsedReferredBetsType, ReferralParsedLegsType, decodeResponseGetReferredBets } from 'src/state/Test/betSlipState/betting/getReferredTypes';
import { SuccessPlaceBetResponseType } from 'src/state/Test/betSlipState/betting/postPlaceBetTypes';
import { ReferralModelType } from 'src/state/Test/betSlipState/betting/getReferredBetSlipTypes';
import { ForTotalStakeTypes, BetSlipUserDataType } from './BetSlipSheredTypes';
import { PossibleBetsRequestState } from './PossibleBetsState/PossibleBetsState';
import { apiCommon } from 'src/api/ApiCommon';
import { ReferralBetsExtended } from 'src/api/config/betting/getReferredBetSlipDecode';
import { AccountState } from 'src/appState/accountState/AccountState';
import { ModelsState } from 'src_common/common/websocket2/ModelsState';
import { Router } from 'src/utils/Router';
import { BasicBetSlipState } from './BasicBetSlipState';

export interface ResponseSuccessType {
    status: 'success',
    data: ParsedReferredBetsType;
}

interface ResponseErrorType {
    status: 'error',
    data: {
    }
}

export type ReferralResponseType = ResponseSuccessType | ResponseErrorType | null

class ConnectWrapper {
    public connect(self: MobxValue<Date | null>): NodeJS.Timeout {
        const timer = setInterval((): void => {
            self.setValue(new Date());
        }, 1000);

        return timer;
    }
    public dispose(timer: NodeJS.Timeout): void {
        clearInterval(timer);
    }
}

const currentTimeBox: MobxValue<Date | null> = MobxValue.create({
    initValue: null,
    connect: new ConnectWrapper()
});

export class ReferralState {
    private readonly possibleBetsRequestState: PossibleBetsRequestState;
    private readonly accountState: AccountState;
    private readonly router: Router;
    private readonly models: ModelsState;
    private readonly basicBetSlipState: BasicBetSlipState;
    private readonly setMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void;
    private readonly onPlaceBetSuccess: (bets: Array<SuccessPlaceBetResponseType>) => void
    private readonly getAccountData: () => BetSlipUserDataType;
    private readonly onCleanAll: () => void;
    public forViewLegsItemMap: MobxMapAutoNew<number, LegItem>;


    @observable.ref public referralDataInner: ReferralTypeModel | null;

    public forViewCombinationsItemMap: MobxMapAutoNew<string, CombinationItem>;
    private getReferredBetSlipResource: Resource<ReferralResponseType> | null;

    public constructor(
        router: Router,
        possibleBetsRequestState: PossibleBetsRequestState,
        accountState: AccountState,
        models: ModelsState,
        basicBetSlipState: BasicBetSlipState,
        setMapCorePrepareLegs: (betId: number, legModel: GetPossibleBetsLegsRequestType) => void,
        onPlaceBetSuccess: (bets: Array<SuccessPlaceBetResponseType>) => void,
        getAccountData: () => BetSlipUserDataType,
        onCleanAll: () => void,
    ) {
        this.router = router;
        this.basicBetSlipState = basicBetSlipState;
        this.possibleBetsRequestState = possibleBetsRequestState;
        this.accountState = accountState;
        this.models = models;
        this.setMapCorePrepareLegs = setMapCorePrepareLegs;
        this.referralDataInner = null;
        this.onPlaceBetSuccess = onPlaceBetSuccess;
        this.getAccountData = getAccountData;
        this.onCleanAll = onCleanAll;

        this.forViewLegsItemMap = new MobxMapAutoNew((selectionId: number) => {
            return new LegItem(() => this.getLegById(selectionId), this, this.accountState, this.models);
        });

        this.forViewCombinationsItemMap = new MobxMapAutoNew((combinationType: string) => {
            return new CombinationItem(() => this.getCombinationById(combinationType));
        });

        this.getReferredBetSlipResource = new Resource(async (): Promise<ReferralResponseType | null> => {
            const response = await apiCommon.getReferredBetSlip.run({});


            if (response.responseType === 'success') {
                const bets: Array<ReferralBetsExtended> = response.json.bets.map((elem) => {
                    return {
                        ...elem,
                        legs: elem.legs.map((item => {

                            if (item.type !== 'empty') {
                                return {
                                    ...item,
                                    selectionId: item.selection.id,
                                    eventId: item.event.id,
                                    marketId: item.market.id,
                                    eventName: undefined,
                                    selectionName: undefined,
                                };
                            } else {
                                return {
                                    ...item,
                                    selectionName: item.selection.name,
                                    eventName: item.event.name,
                                    eventId: undefined,
                                    selectionId: undefined,
                                    marketId: undefined,
                                };
                            }
                        }))
                    };
                });

                const parsedResponse = mapOfferBets(bets, response.json.expiresAt, response.json.type);
                const decodedResponse = decodeResponseGetReferredBets(parsedResponse);

                if (decodedResponse instanceof Error) {
                    console.log('parsedResponse',parsedResponse);
                    console.error(decodedResponse);
                    return null;
                }

                if (response.json.expiresAt !== null) {
                    const isActive = moment(response.json.expiresAt).diff(moment());
                    if (isActive < 0) {
                        return {
                            status: 'error',
                            data: {},
                        };
                    }
                }

                this.setReferralLegs(decodedResponse.legs);
                return {
                    status: 'success',
                    data: decodedResponse
                };
            }

            return null;
        });
    }

    @action public onCancelOffer =  (): void => {
        setTimeout(() => {
            this.onCleanAll();
        }, 3000);
    }

    @action private setReferralLegs = (legs: Record<string, ReferralParsedLegsType>): void => {
        for (const leg of Object.values(legs)) {
            if (leg.id !== null) {
                const legNum = typeof leg.id === 'number' ? leg.id : parseInt(leg.id, 10);

                if (leg.eventId !== null && leg.marketId !== null && leg.selectionId !== null) {
                    const legModel: GetPossibleBetsLegsRequestType = {
                        eventId: leg.eventId,
                        marketId: leg.marketId,
                        selectionId: leg.selectionId,
                        id: leg.selectionId,
                        priceType: leg.priceType,
                        timestamp: 0,
                        stakePerLine: leg.stakePerLine,
                        potentialReturns: null,
                        related: false,
                        errors: [],
                        eachWay: leg.eachWay,
                        freebetRemarks: [],
                        freebetCredits: [],
                        maxStake: null,
                        potentialReturnsAt: 0,
                        oldPrice: null,
                        name: leg.eventName ?? '',
                        potentialReturnsEw: 0,
                        type: leg.type,
                        index: null,
                        price: null,
                    };
                    this.setMapCorePrepareLegs(legNum, legModel);
                }
            }
        }
    }

    @action public handleBetReferralData = (referralRawData: ReferralModelType): void => {

        const headerType = referralRawData.header.type;

        switch (headerType) {
        case 'request':
            this.referralDataInner = this.calcReferralResponse(referralRawData);
            break;

        case 'offered':
            this.referralDataInner = this.calcReferralResponse(referralRawData);
            break;

        case 'reject':
            this.onRejectByTrader(referralRawData);
            break;

        case 'accept':
            this.onPlaceBetSuccess(referralRawData.body.bets);
            break;

        default:
            break;
        }

        if (this.getReferredBetSlipResource !== null && headerType !== 'assigned') {
            this.getReferredBetSlipResource = null;
        }
        if (this.basicBetSlipState.isShowQuickBet === true) {
            this.router.redirectToBetslip();
        }
        this.updateBetSlipModels();
    }

    @action private updateBetSlipModels = (): void => {
        if (this.parsedLegs !== null) {
            for (const leg of Object.values(this.parsedLegs)) {
                if (leg.index !== null && leg.stakePerLine !== null && leg.stakePerLine !== undefined) {
                    const item = this.forViewLegsItemMap.get(leg.index);
                    //if (item !== null) {
                    item.updateModel(leg);
                    //}
                }
            }
        }
        if (this.parsedCombinations !== null) {
            for (const combination of Object.values(this.parsedCombinations)) {
                if (/*combination.type !== null &&*/ combination.stakePerLine !== null /*&& combination.stakePerLine !== undefined*/) {
                    const item = this.forViewCombinationsItemMap.get(combination.type);
                    //if (item !== null) {
                    item.updateModel(combination);
                    //}
                }
            }
        }
    }

    @action public onRejectOffer = async (): Promise<void> => {
        await postRejectOffer();
        setTimeout(() => {
            this.onCleanAll();
        }, 5000);
    }

    @action public onAcceptOffer = async (): Promise<void> => {
        const response = await postAcceptOffer();

        if (response !== null && response.status === 'success' /*&& response.data !== null*/) {
            this.onPlaceBetSuccess(response.data);
        }
    }

    private getLegById = (legId: number): LegType | null => {
        if (this.referralData !== null && this.parsedLegs !== null) {
            return this.parsedLegs[legId] ?? null;
        }
        return null;
    }

    private getCombinationById = (combinationType: string): CombinationsType | null => {
        if (this.referralData !== null && this.parsedCombinations !== null) {
            return this.parsedCombinations[combinationType] ?? null;
        }
        return null;
    }

    private calcReferralResponse = (referralRawData: ReferralModelType): ReferralTypeModel | null => {
        const offer = referralRawData.body.referredBetslip;
        const dataInner = mapOfferBetsOld(offer.bets);
        const decodeData = decodeReferralType(dataInner);

        if (decodeData instanceof Error) {
            console.error(decodeData);
            return null;
        }

        const expiresAt = offer.expiresAt !== null ? moment().add(moment(offer.expiresAt).diff(moment(referralRawData.header.when), 'seconds'), 'seconds').toString() : null;

        return {
            combinations: decodeData.combinations,
            legs: decodeData.legs,
            expiresAt: expiresAt,
            status: referralRawData.header.type,
            user: referralRawData.header.who.type
        };
    }

    private onRejectByTrader = (referralRawData: ReferralModelType): void => {
        this.referralDataInner = this.calcReferralResponse(referralRawData);
        setTimeout(() => {
            this.onCleanAll();
        }, 5000);
    }

    @computed public get isReferred(): boolean {
        return this.referralData !== null;
    }

    @computed private get getReferredBetSlip(): ResponseSuccessType | null {
        const accountData =  this.getAccountData();

        if (/*accountData !== undefined &&*/ accountData.accountAuthenticated && this.getReferredBetSlipResource !== null) {
            const referralResponseResult = this.getReferredBetSlipResource.get();
            if (referralResponseResult.type === 'ready' && referralResponseResult.value !== null) {
                if (referralResponseResult.value.status === 'success') {
                    return referralResponseResult.value;
                }
            }
        }

        return null;
    }

    @computed private get referralDataResponse(): ParsedReferredBetsType | null {
        if (this.getReferredBetSlip !== null) {
            return this.getReferredBetSlip.data;
        }
        return null;
    }

    @computed private get referralDataModel(): ReferralTypeModel | null {
        if (this.referralDataResponse !== null) {
            const combinations: Record<string, ReferralCombinationType> = {};
            for (const combination of Object.values(this.referralDataResponse.combinations)) {
                combinations[combination.type] = {
                    type: combination.type,
                    correlationID: '',
                    stakePerLine: combination.stakePerLine,
                    eachWay: combination.eachWay,
                    comment: null,
                    country: '',
                    name: '',
                    channel: 'desktop',
                    potentialReturns: combination.potentialReturns,
                    tax: undefined,
                    freebet: false,
                    legs: [],
                };
            }

            const legs: Record<string, ReferralLegType> = {};
            for (const leg of Object.values(this.referralDataResponse.legs)) {
                if (leg.price !== null && leg.eventId !== null && leg.marketId !== null && leg.selectionId !== null) {
                    legs[leg.index] = {
                        type: leg.type,
                        sport: null,
                        eachWayTerms: null,
                        termsWithBet: null,
                        eventCountry: [],
                        price: leg.price,
                        priceType: leg.priceType,
                        eventId: leg.eventId,
                        marketId: leg.marketId.toString(),
                        selectionId: leg.selectionId.toString(),
                        id: leg.selectionId.toString(),
                        index: leg.index.toString(),
                        stakePerLine: leg.stakePerLine,
                        eachWay: leg.eachWay,
                        potentialReturns: null,
                    };
                }

            }

            return {
                combinations: combinations,
                legs: legs,
                expiresAt: this.referralDataResponse.expiresAt,
                status: this.referralDataResponse.type,
                user: '',
            };
        }
        return null;
    }

    @computed public get referralData(): ReferralTypeModel | null {
        if (this.referralDataInner !== null) {
            return this.referralDataInner;
        }

        if (this.referralDataModel !== null) {
            return this.referralDataModel;
        }

        return null;

    }

    @computed private get parsedLegs(): Record<number, LegType> | null {
        if (this.referralData !== null) {
            const tempLegs: Record<number, LegType> = {};
            const { legsPossibleBetsResponseMap } = this.possibleBetsRequestState;
            for (const leg of Object.values(this.referralData.legs)) {
                const selectionId = parseInt(leg.selectionId, 10);
                const index = parseInt(leg.index, 10);
                const marketId = parseInt(leg.marketId, 10);

                if (!isNaN(index) && !isNaN(selectionId)) {
                    const oldPossibleLegs = legsPossibleBetsResponseMap.get(selectionId) ?? null;
                    tempLegs[index] = {
                        eachWay: leg.eachWay,
                        errors: oldPossibleLegs !== null ? oldPossibleLegs.errors : [],
                        eventId: leg.eventId,
                        freebetCredits: oldPossibleLegs !== null ? oldPossibleLegs.freebetCredits : null,
                        freebetRemarks: oldPossibleLegs !== null ? oldPossibleLegs.freebetRemarks : null,
                        marketId: !isNaN(marketId) ? marketId : null,
                        maxStake: oldPossibleLegs !== null ? oldPossibleLegs.maxStake : null,
                        potentialReturns: leg.potentialReturns !== null && leg.potentialReturns !== undefined ? leg.potentialReturns : oldPossibleLegs !== null ? oldPossibleLegs.potentialReturns : null,
                        potentialReturnsAt: oldPossibleLegs !== null ? oldPossibleLegs.potentialReturnsAt : null,
                        potentialReturnsEw: oldPossibleLegs !== null ? oldPossibleLegs.potentialReturnsEw : null,
                        price: leg.price,
                        priceType: leg.priceType,
                        related: oldPossibleLegs !== null ? oldPossibleLegs.related : null,
                        selectionId: selectionId,
                        index: index,
                        stakePerLine: leg.stakePerLine,
                        totalStake: oldPossibleLegs !== null ? oldPossibleLegs.totalStake : null,
                        timestamp: oldPossibleLegs !== null ? oldPossibleLegs.timestamp : null,
                        numLines: oldPossibleLegs !== null ? oldPossibleLegs.numLines : null,
                        tax: null,
                        uuid: oldPossibleLegs?.uuid ?? '',
                    };
                }
            }

            return tempLegs;
        }
        return null;
    }

    @computed private get parsedCombinations(): Record<string, CombinationsType> | null {
        if (this.referralData !== null) {
            const tempCombinations: Record<string, CombinationsType> = {};
            for (const combination of Object.values(this.referralData.combinations)) {
                const oldPossibleCombination = Array.from(this.possibleBetsRequestState.combinationsForViewMap.values()).find(comb => comb.type === combination.type);
                if (/*oldPossibleCombination !== null &&*/ oldPossibleCombination !== undefined) {
                    tempCombinations[combination.type] = {
                        errors: oldPossibleCombination.errors ?? null,
                        ewOffered: false,
                        eachWay: combination.eachWay,
                        freebetCredits: oldPossibleCombination.freebetCredits,
                        freebetRemarks: oldPossibleCombination.freebetRemarks,
                        legs: oldPossibleCombination.legs,
                        maxStake: oldPossibleCombination.maxStake,
                        name: oldPossibleCombination.name,
                        numLines: oldPossibleCombination.numLines,
                        potentialReturns: combination.potentialReturns,
                        potentialReturnsAt: null,
                        potentialReturnsEw: oldPossibleCombination.potentialReturnsEw ?? null,
                        price: oldPossibleCombination.price,
                        stakePerLine: combination.stakePerLine,
                        totalStake: oldPossibleCombination.totalStake ?? null,
                        type: combination.type,
                        tax: combination.tax ?? null,
                    };
                }

            }

            return tempCombinations;
        }
        return null;
    }

    @computed public get legsIds(): number[] {
        if (this.parsedLegs !== null) {
            return Object.keys(this.parsedLegs).map((legId) => {
                return parseInt(legId, 10);
            });
        }
        return [];
    }

    @computed public get combinationsTypes(): string[] {
        if (this.parsedCombinations !== null) {
            return Object.keys(this.parsedCombinations);
        }
        return [];
    }

    @computed public get expiresAt(): string | null {
        return this.referralData?.expiresAt ?? null;
    }

    @computed public get status(): string | null {
        return this.referralData !== null ? this.referralData.status : null;
    }

    @computed private get user(): string | null {
        if (this.referralData !== null /*&& typeof this.referralData.user === 'string'*/) {
            return this.referralData.user;
        }
        return null;
    }

    @computed public get totalStake(): Array<ForTotalStakeTypes> {
        const prepareForTotalStake: Array<ForTotalStakeTypes> = [];

        if (this.parsedCombinations !== null) {
            for (const combination of Object.values(this.parsedCombinations)) {

                //if (combination !== null) {
                prepareForTotalStake.push({
                    eachWay: combination.eachWay,
                    numLines: combination.numLines,
                    stakePerLine: combination.stakePerLine
                });
                //}
            }
        }
        if (this.parsedLegs !== null) {
            for (const leg of Object.values(this.parsedLegs)) {

                //if (leg !== null) {
                prepareForTotalStake.push({
                    eachWay: leg.eachWay,
                    numLines: /*leg.numLines !== undefined ? leg.numLines : null,*/ leg.numLines,
                    stakePerLine: leg.stakePerLine !== undefined ? leg.stakePerLine : null
                });
                //}
            }
        }
        return prepareForTotalStake;
    }

    @computed public get totalPotentialReturn(): number {
        let totalPotentialReturn: number = 0;
        if (this.parsedCombinations !== null) {
            for (const combination of Object.values(this.parsedCombinations)) {

                if (/*combination !== null &&*/ combination.potentialReturns !== null && combination.stakePerLine !== null && combination.stakePerLine > 0) {
                    totalPotentialReturn = totalPotentialReturn + combination.potentialReturns;
                }
            }
        }
        if (this.parsedLegs !== null) {
            for (const leg of Object.values(this.parsedLegs)) {

                if (/*leg !== null &&*/ leg.potentialReturns !== null && leg.stakePerLine !== undefined && leg.stakePerLine !== null && leg.stakePerLine > 0) {
                    totalPotentialReturn = totalPotentialReturn + leg.potentialReturns;
                }
            }
        }
        return totalPotentialReturn;
    }

    @computed public get offerExpiryTime(): number | null {
        const offerExpiryDate = this.expiresAt !== null ? new Date(this.expiresAt) : null;

        if (offerExpiryDate !== null) {
            const nowDate = currentTimeBox.getValue();

            if (nowDate === null) {
                return null;
            }

            const diff = offerExpiryDate.getTime() - nowDate.getTime();
            const diffValue = Math.floor(diff / 1000);

            if (diffValue >= -2) {
                return diffValue;
            }
        }

        return null;
    }

    @computed public get coreCombinationsPossibleBetsRequest(): Record<string, CombinationsRequestType> {
        const tempObj: Record<string, CombinationsRequestType> = {};
        if (this.referralData !== null) {
            for (const combination of Object.values(this.referralData.combinations)) {
                tempObj[combination.type] = {
                    legs: [],
                    potentialReturns: combination.potentialReturns ?? 0,
                    price: null,
                    ewOffered: false,
                    name: '',
                    maxStake: null,
                    stakePerLine: combination.stakePerLine,
                    potentialReturnsEw: 0,
                    potentialReturnsAt: 0,
                    numLines: 1,
                    type: combination.type,
                    eachWay: combination.eachWay,
                    freebetCredits: [],
                    freebetRemarks: [],
                };
            }
        }
        return tempObj;
    }

    @computed public get isReferredBetMessage(): boolean {
        return this.referralData !== null && (this.status === 'request' || this.status === 'assigned');
    }
    @computed public get isRejectedByTrader(): boolean {
        return this.referralData !== null && this.status === 'reject' && this.user === 'staff';
    }
    @computed public get isRejectedByCustomer(): boolean {
        return this.referralData !== null && this.status === 'reject' && this.user === 'customer';
    }
    @computed public get isBetSlipOffer(): boolean {
        return this.referralData !== null && (this.status === 'offered' || this.status === 'offer');
    }

    @computed public get isRejectedBet(): boolean {
        return this.referralData !== null ? this.status === 'reject' : false;
    }
}





//evil thing from modules/betting
//@ts-expect-error
//eslint-disable-next-line
const mapOfferBetsOld = (bets) => {
    const combinations = {};
    const legs = {};
    let channel;
    let emptyBetId = 0;

    for (const bet of bets) {
        if (bet.type === 'SGL' && bet.legs.length === 1) {
            //eslint-disable-next-line
            const leg = parseLeg(bet.legs[0]);
            let id = leg.id;

            //eslint-disable-next-line
            if (leg.empty) {
                emptyBetId++;

                //eslint-disable-next-line
                id = 'empty' + emptyBetId;

                //@ts-expect-error
                //eslint-disable-next-line
            } else if (legs[id]) {
                //eslint-disable-next-line
                id = id + Object.keys(legs).filter(x => x.split('-')[0] === id).length;
            }

            //@ts-expect-error
            //eslint-disable-next-line
            legs[id] = leg;

            leg.index = id;
            leg.stakePerLine = bet.stakePerLine;
            leg.eachWay = bet.eachWay;
            leg.potentialReturns = bet.potentialReturns;
        } else {
            // @TODO: Think about multiple combinations of same type
            // @TODO: Think about combinations of part legs

            //@ts-expect-error
            //eslint-disable-next-line
            combinations[bet.type] = bet;

            for (let leg of bet.legs) {
                leg = parseLeg(leg);
                let id = leg.id;

                //eslint-disable-next-line
                if (leg.empty) {
                    emptyBetId++;
                    //eslint-disable-next-line
                    id = 'empty' + emptyBetId;
                //@ts-expect-error
                //eslint-disable-next-line
                } else if (legs[id]) {
                    continue;
                }

                //@ts-expect-error
                //eslint-disable-next-line
                legs[id] = leg;

                leg.index = id;
                leg.stakePerLine = 0;
                leg.eachWay = false;
            }

            delete bet.legs;
        }
        channel = bet.channel;
    }

    return { combinations, legs, channel };
};

//@ts-expect-error
//eslint-disable-next-line
const parseLeg = (leg) => {
    let id;

    //eslint-disable-next-line
    if (!leg.selectionId && (!leg.selection || !leg.selection.id)) {
        leg.empty = true;
        leg.selectionName = leg.selection.name;
        leg.eventName = leg.event.name;
        delete leg.selection;
        delete leg.event;
    } else {

        //eslint-disable-next-line
        id = leg.selectionId || leg.selection.id;

        //eslint-disable-next-line
        leg.eventId = leg.eventId || leg.event.id;
        //eslint-disable-next-line
        leg.marketId = leg.marketId || leg.market.id;
        //eslint-disable-next-line
        leg.selectionId = leg.selectionId || leg.selection.id;
        delete leg.event;
        delete leg.market;
        delete leg.selection;
    }

    leg.id = id;
    leg.eventId = parseInt(leg.eventId, 10);
    //eslint-disable-next-line
    leg.marketId = '' + leg.marketId;
    //eslint-disable-next-line
    leg.selectionId = '' + leg.selectionId;

    return leg;
};
