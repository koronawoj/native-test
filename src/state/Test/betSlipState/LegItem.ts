import { LegType, ErrorsType } from './BetSlipTypes';
import { computed, observable, action } from 'mobx';
import { FormInputState } from 'src/state/Test/utils/Form';
import { StakeInputState, StakeDataTypes } from './StakeInputState';
import { PriceType, FreeBetCreditsType, FreeBetRemarksType } from './BetSlipSheredTypes';
import { ModelsState } from 'src/state/Test/websocket2/ModelsState';
import { AccountState } from 'src/state/Test/accountState/AccountState';

export const convertToNumber = (toConvert:string | number | undefined | null):number | null => {
    if (typeof toConvert === 'number') {
        return toConvert;
    }

    if (toConvert === '') {
        return 0;
    }

    if (toConvert === null || toConvert === undefined) {
        return null;
    }

    const parsedNumber = parseFloat(toConvert);

    if (isNaN(parsedNumber)) {
        return null;
    }

    return parsedNumber;
};

interface OptionType {
    priceType: string,
    label: string
}
export class LegItem {
    public readonly stakeValue: FormInputState<string>;
    public readonly stakeInputState: StakeInputState;
    public readonly models: ModelsState;
    @observable private selectionPrice: PriceType | null;
    @observable private stakeInputValue: number = 0;

    private readonly getLeg: () => LegType | null;
    public readonly accountState: AccountState;
    private readonly onChangeStake?: (betId: number, stakeValue: number) => void;
    private readonly onRemoveLeg?: (betId: number) => void;
    private readonly onChangeEachWay?: (betId: number, checked: boolean) => void;
    private readonly onChangePriceType?: (betId: number, price: string) => void;

    @observable.ref public refSelection:  HTMLElement | null = null;

    public constructor(
        getLeg: () => LegType | null,
        accountState: AccountState,
        models: ModelsState,
        onChangeStake?: (betId: number, stakeValue: number) => void,
        onRemoveLeg?: (betId: number) => void, onChangeEachWay?: (betId: number, checked: boolean) => void,
        onChangePriceType?: (betId: number, price: string) => void,
    ) {
        this.getLeg = getLeg;
        this.accountState = accountState;
        this.models = models;
        this.onChangeStake = onChangeStake;
        this.onRemoveLeg = onRemoveLeg;
        this.onChangeEachWay = onChangeEachWay;
        this.onChangePriceType = onChangePriceType;

        const leg = this.getLeg();

        this.stakeValue = new FormInputState(leg !== null ? leg.stakePerLine !== undefined && leg.stakePerLine !== null ? leg.stakePerLine !== 0 ? (leg.stakePerLine / 100).toString() : '' : '' : '', false);
        this.selectionPrice = leg !== null ? leg.price : null;

        this.stakeInputState = new StakeInputState(this.stakeValue, this.handleOnChange, this.getPrice);
    }

    @computed private get leg(): LegType | null {
        return this.getLeg();
    }

    public getPrice = (): PriceType | null => {
        return this.price;
    }

    public getStake = (): number => {
        return this.stakeInputValue;
    }

    public handleOnChange = (data: StakeDataTypes): void => {
        if (this.selectionId !== null && this.onChangeStake !== undefined) {
            this.onChangeStake(this.selectionId, data.stakePerLine);
        }
    }

    @computed public get legId(): number | null {
        return this.leg !== null ? this.leg.selectionId : null;
    }
    @computed public get eachWay(): boolean | null {
        return this.leg !== null ? this.leg.eachWay : null;
    }
    @computed public get errors(): Array<ErrorsType> {
        return this.leg !== null ? this.leg.errors : [];
    }
    @computed public get eventId(): number | null {
        return this.leg !== null ? this.leg.eventId : null;
    }
    @computed public get freebetCredits(): Array<FreeBetCreditsType> | null {
        return this.leg !== null ? this.leg.freebetCredits : null;
    }
    @computed public get freebetRemarks(): Array<FreeBetRemarksType> | null {
        return this.leg !== null ? this.leg.freebetRemarks : null;
    }
    @computed public get marketId(): number | null {
        return this.leg !== null ? convertToNumber(this.leg.marketId) : null;
    }
    @computed public get maxStake(): number | null {
        return this.leg !== null ? convertToNumber(this.leg.maxStake) : null;
    }
    @computed public get potentialReturns(): number | null {
        return this.leg !== null ? this.leg.potentialReturns : null;
    }
    @computed public get potentialReturnsAt(): number | null {
        return this.leg !== null ? this.leg.potentialReturnsAt : null;
    }
    @computed public get price(): PriceType | null {
        return this.leg !== null ? this.leg.price : null;
    }
    @computed public get priceType(): string | undefined {
        return this.leg !== null ? this.leg.priceType : undefined;
    }
    @computed public get related(): boolean | null {
        return this.leg !== null ? this.leg.related : null;
    }
    @computed public get selectionId(): number | null {
        return this.leg !== null ? convertToNumber(this.leg.selectionId) : null;
    }
    @computed public get stakePerLine(): number | null {
        return this.leg !== null ? this.leg.stakePerLine ?? null : null;
    }
    @computed public get timestamp(): number | null {
        return this.leg !== null ? this.leg.timestamp : null;
    }
    @computed public get isSelectedSP(): boolean {
        return this.leg !== null ? this.leg.priceType === 'sp' : false;
    }
    @computed public get isSelected(): boolean {
        return this.leg !== null;
    }
    @computed public get display(): boolean {
        return this.display;
    }

    @action public updateModel = (leg:LegType):void => {
        if (leg.stakePerLine !== undefined && leg.stakePerLine !== null && leg.stakePerLine !== 0) {
            this.stakeValue.setValue((leg.stakePerLine / 100).toString());
        }

        if (this.selectionPrice === null) {
            this.selectionPrice = leg.price;
        }
    }

    @action public acceptChanges = ():void => {
        this.selectionPrice = this.price;
    }

    @computed public get selectionChanged(): boolean {
        if (this.leg !== null && this.selectionPrice !== null && this.leg.price !== null) {
            return this.selectionPrice.d !== this.leg.price.d;
        }
        return false;
    }

    @computed public get selectionChangedDirection(): 'up' | 'down' | null {
        if (this.leg !== null && this.selectionPrice !== null && this.leg.price !== null) {
            if (this.selectionPrice.d !== this.leg.price.d) {
                return this.selectionPrice.d > this.leg.price.d ? 'down' : 'up';
            }
        }
        return null;
    }

    public handleChangeEachWay = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectionId = this.selectionId;

        if (selectionId !== null && this.onChangeEachWay !== undefined) {
            this.onChangeEachWay(selectionId, e.currentTarget.checked);
        }
    }

    @computed public get priceOptions(): Array<OptionType> | undefined {
        const selectionModel = this.leg !== null && this.selectionId !== null && this.marketId !== null
            ? this.models.getSelectionAndLoad(this.marketId, this.selectionId) : null;
        if (selectionModel !== null) {
            const price = this.price !== null ? this.price : selectionModel.price;
            const sp = selectionModel.sp;
            const { oddsFormat } = this.accountState;
            const options: Array<OptionType> = [];
            if (price !== undefined) {
                const label = oddsFormat === 'decimal' ? price.d.toFixed(2).toString() : price.f;

                options.push({
                    priceType: 'fp',
                    label: label
                });
            }
            if (sp) {
                options.push({
                    priceType: 'sp',
                    label: 'SP'
                });
            }
            return options;
        }
    }

    @computed public get selectedPriceType(): string | undefined {
        return this.priceOptions?.filter(({ priceType }): boolean => {
            if (this.priceType === priceType) {
                return true;
            }
            return false;
        }).map(el => el.label)[0];
    }

    @computed public get notSelectedPriceType(): string | undefined {
        return this.priceOptions?.filter(({ priceType }): boolean => {
            if (this.priceType !== priceType) {
                return true;
            }
            return false;
        }).map(el => el.priceType)[0];
    }

    public get switchDisabled(): boolean {
        if (this.priceOptions !== undefined) {
            return this.priceOptions.length < 2;
        }
        return true;
    }

    public handleSwitchPriceType = (): void => {
        const selectionId = this.selectionId;
        if (selectionId !== null && this.onChangePriceType !== undefined && this.notSelectedPriceType !== undefined) {
            if (this.switchDisabled) {
                return;
            }
            this.onChangePriceType(selectionId, this.notSelectedPriceType);
        }
    }

    public handleChangePriceType = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectionId = this.selectionId;

        if (selectionId !== null && this.onChangePriceType !== undefined) {
            this.onChangePriceType(selectionId, e.currentTarget.value);
        }
    }

    public removeLeg = (): void => {
        const selectionId = this.selectionId;

        if (selectionId !== null && this.onRemoveLeg !== undefined) {
            this.onRemoveLeg(selectionId);
        }
    }

    @computed public get returns(): number | null {
        if (
            (this.potentialReturnsAt === this.stakePerLine || this.eachWay !== null) && this.priceType !== 'sp') {
            return this.potentialReturns !== null ? this.potentialReturns : 0;
        }

        if (this.priceType === 'sp') {
            return null;
        }

        if (this.price !== null) {
            const price = this.price.f.split('/');
            const priceDen = convertToNumber(price[0]);
            const priceNum = convertToNumber(price[1]);

            if (priceDen !== null && priceNum !== null && this.stakePerLine !== null) {
                return priceDen * this.stakePerLine /priceNum + this.stakePerLine;
            }
        }
        return 0;
    }

    @action public setRef = (ref: HTMLElement | null): void => {
        this.refSelection = ref;
    }

    public isSelectedBet = (sp:boolean): boolean => {

        const selectionId = this.legId;
        const marketId = this.marketId;
        if (selectionId !== null && marketId !== null){
            if (sp === true && this.isSelectedSP === false) {
                return false;
            }
            if (sp === false && this.isSelectedSP === true) {
                return false;
            }

            return true;
        }
        return false;
    }
}
