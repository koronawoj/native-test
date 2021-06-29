import { FormInputState } from "src/state/Test/utils/Form";
import { PriceType } from "./BetSlipSheredTypes";

export const isDecimalCheck = (stake: string):boolean => {
    const regex = /[.,]/;

    return regex.exec(stake) !== null;
};

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

export interface StakeDataTypes {
    stakePerLine: number,
    potentialReturns?: number,
    potentialReturnsEw?: number,
}

export class StakeInputState {
    private handleOnChange: (data: StakeDataTypes) => void;
    private readonly stakeValue: FormInputState<string>;
    private getPrice: () => PriceType | null;

    constructor(stakeValue: FormInputState<string>, handleOnChange: (data: StakeDataTypes) => void, getPrice: () => PriceType | null) {
        this.stakeValue = stakeValue;
        this.handleOnChange = handleOnChange;
        this.getPrice = getPrice;
    }

    private onChange = (value: string): void => {
        if(this.isNumberCheck(value)) {
            const price = this.getPrice();
            this.stakeValue.setValue(value);

            const valueNum = convertToNumber(value);
            const amount = valueNum !== null ? valueNum * 100 : 0;
            let data = {
                stakePerLine: Math.round(amount),
                potentialReturns: 0,
                potentialReturnsEw: 0,
            };

            if(price !== null) {
                const priceArr = price.f.split('/');
                const priceDen = convertToNumber(priceArr[0]);
                const priceNum = convertToNumber(priceArr[1]);

                if(valueNum !== null && priceDen !== null && priceNum !== null) {
                    const amount = valueNum * 100;

                    const returnVal = priceDen * amount /priceNum + amount;

                    data = {
                        stakePerLine: Math.round(amount),
                        potentialReturns: returnVal, //todo to remove duplicate
                        potentialReturnsEw: returnVal //todo to remove duplicate
                    };
                }
            }

            this.handleOnChange(data);
        }
    }

    private handleInteger = (value: string): void => {
        this.onChange(value);
    }

    private handleFloat = (value: string): void => {
        const splitValue = value.split(/[.,]/);

        if(splitValue.length === 2) {
            const secondSplitValue = splitValue[1] ?? null;
            if(secondSplitValue !== null && secondSplitValue.length <= 2) {
                if(secondSplitValue === '') {
                    this.stakeValue.setValue(value);
                } else {
                    this.onChange(value);
                }
            }
        }
    }

    private isNumberCheck = (value: string): boolean => {
        const number = Number(value);
        return !isNaN(number);
    }

    public handleChange = (value: string): void => {
        if (isDecimalCheck(value)) {
            this.handleFloat(value);
        } else {
            this.handleInteger(value);
        }
    }
}