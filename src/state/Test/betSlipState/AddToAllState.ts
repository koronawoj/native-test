import { FormInputState } from "@twoupdigital/mobx-utils/libjs/Form";
import { LegItem } from "./LegItem";
import { StakeInputState, StakeDataTypes } from "./StakeInputState";

export class AddToAllState {
    private readonly getLegsIds: () => number[];
    private readonly getLegById: (id:number) => LegItem | null;

    public readonly stakeInputState: StakeInputState;

    public readonly stakeValue: FormInputState<string>;

    public readonly selectionId = 'all';
    
    public refSelection:  HTMLElement | null = null;

    constructor(getLegsIds: () => number[], getLegById: (id:number)  => LegItem | null) {
        this.getLegsIds = getLegsIds;
        this.getLegById = getLegById;
        this.stakeValue = new FormInputState('', false);
        this.stakeInputState = new StakeInputState(this.stakeValue, this.handleOnChange, ():null => null);
    }

    public handleOnChange = (data: StakeDataTypes): void => {

        const legIds = this.getLegsIds();

        for(const legId of legIds) {

            const legItem = this.getLegById(legId);
            if(legItem !== null) {
                legItem.stakeInputState.handleChange((data.stakePerLine/100).toString());
            }
        }
    }

    public setRef = (ref: HTMLElement | null): void => {
        this.refSelection = ref;
    }
}