import { ErrorsType, CombinationsType } from "./BetSlipTypes";
import { computed, observable, action } from "mobx";
import { FormInputState } from "src/state/Test/utils/Form";
import { StakeInputState, StakeDataTypes } from "./StakeInputState";
import { PriceType, FreeBetCreditsType } from "./BetSlipSheredTypes";

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

export class CombinationItem {
    public readonly stakeValue: FormInputState<string>;
    private readonly onChangeCombinationStake?: (combinationType: string, stakeValue: number) => void;
    private readonly onChangeEachWay?: (combinationType: string, checked: boolean) => void;
    public readonly stakeInputState: StakeInputState;

    @observable.ref private getCombinationById: () => CombinationsType | null;
    @observable private isExpandedRaw: boolean;
    // @observable public returnsAtOneStake: number | undefined | null;

    @observable public refSelection:  HTMLElement | null = null;

    constructor(getCombinationById: () => CombinationsType | null, onChangeCombinationStake?: (combinationType: string, stakeValue: number) => void, onChangeEachWay?: (combinationType: string, checked: boolean) => void) {
        this.getCombinationById = getCombinationById;
        this.onChangeCombinationStake = onChangeCombinationStake;
        this.onChangeEachWay = onChangeEachWay;
        const combination = this.getCombinationById();

        this.stakeValue = new FormInputState(combination  !== null && combination .stakePerLine !== 0 && combination .stakePerLine !== null ? (combination .stakePerLine / 100).toString() : '', false);

        this.isExpandedRaw = true;

        this.stakeInputState = new StakeInputState(this.stakeValue, this.handleOnChange, this.getPrice);
    }

    getPrice = (): PriceType | null => {
        return this.price;
    }

    handleOnChange = (data: StakeDataTypes): void => {
        if(this.type !== null && this.onChangeCombinationStake !== undefined) {
            this.onChangeCombinationStake(this.type, data.stakePerLine);
        }
    }

    @computed get combination(): CombinationsType | null {
        return this.getCombinationById();
    }

    @computed get type(): string | null {
        return this.combination !== null ? this.combination.type : null;
    }

    @computed get selectionId(): string | null {
        return this.combination !== null ? this.combination.type : null;
    }

    @computed get errors(): Array<ErrorsType> {

        if(this.combination !== null) {
            const errors = this.combination.errors ?? [];
            const castTypes = ['FC', 'RFC', 'CFC', 'TC', 'CTC'];

            if(castTypes.includes(this.combination.type)) {
                const castErrors = errors.filter(error => error.code !== 'related' && error.code !== 'suspended');
                return castErrors;
            }

            return errors;
        }

        return [];
    }

    @computed get ewOffered(): boolean | null {
        return this.combination !== null ? this.combination.ewOffered ?? null : null;
    }

    @computed get eachWay(): boolean | null {
        return this.combination !== null ? this.combination.eachWay !== null ? this.combination.eachWay : null : null;
    }

    @computed get freebetCredits(): Array<FreeBetCreditsType> | null {
        return this.combination !== null ? this.combination.freebetCredits !== null ? this.combination.freebetCredits : null : null;
    }

    @computed get name(): string {
        return this.combination !== null ? this.combination.name ?? '' : '';
    }

    @computed get numLines(): number | null {
        return this.combination !== null ? this.combination.numLines ?? null : null;
    }

    @computed get potentialReturns(): number | null {
        return this.combination !== null ? this.combination.potentialReturns ?? null : null;
    }

    @computed get freebetRemarks(): boolean | null {
        return this.combination !== null ? this.combination.freebetRemarks !== null ? this.combination.freebetRemarks.length > 0 : null : null;
    }

    @computed get potentialReturnsAt(): number | null {
        return this.combination !== null ? this.combination.potentialReturnsAt ?? null : null;
    }

    @computed get potentialReturnsEw(): number | null {
        return this.combination !== null ? this.combination.potentialReturnsEw ?? null : null;
    }
    @computed get specialMessageStake(): number | null {
        return  this.combination !== null ? this.combination.price !== null ? this.combination.price.d * 100 : this.combination.potentialReturns : null;
    }

    @computed get price(): PriceType | null {
        return this.combination !== null ? this.combination.price !== null ? this.combination.price : null : null;
    }

    @computed get stakePerLine(): number | null {
        return this.combination !== null ? this.combination.stakePerLine !== null ? this.combination.stakePerLine : null : null;
    }


    @action updateModel = (combination:CombinationsType):void => {
        if(combination.stakePerLine !== null && combination.stakePerLine !== 0) {
            this.stakeValue.setValue((combination.stakePerLine / 100).toString());
        }
    }

    @action public isCastCombination(combinationType: string): boolean {
        return ['FC', 'RFC', 'CFC', 'TC', 'CTC'].includes(combinationType);
    }

    @action onChangeExpanded = ():void => {
        this.isExpandedRaw = !this.isExpandedRaw;
    }

    @computed get isExpanded(): boolean {
        return this.isExpandedRaw;
    }

    handleChangeEachWay = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectionId = this.selectionId;


        if(selectionId !== null && this.onChangeEachWay !== undefined) {
            this.onChangeEachWay(selectionId, e.currentTarget.checked);
        }
    }

    @computed get returns(): number {
        if(
            (this.potentialReturnsAt !== null && this.potentialReturnsAt === this.stakePerLine) ||
            (this.price === null) ||
            (this.eachWay !== null)
            ) {
            return this.potentialReturns !== null ? this.potentialReturns : 0;
        }

        const price = this.price.f.split('/');
        const priceDen = convertToNumber(price[0]);
        const priceNum = convertToNumber(price[1]);

        if(priceDen !== null && priceNum !== null && this.stakePerLine !== null) {
            return priceDen * this.stakePerLine /priceNum + this.stakePerLine;
        }

        return 0;
    }

    @action setRef = (ref: HTMLElement | null): void => {
        this.refSelection = ref;
    }

}