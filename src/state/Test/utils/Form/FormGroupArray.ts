import { FormModel } from "./FormModel";
import { action, computed } from "mobx";
import { FormInputState } from ".";

type FormBox<K> = FormInputState<K> | FormModel<K>;

export class FormGroupArray<K> {

    private readonly visitedWhenAllVisited: boolean;
    readonly fields: ReadonlyArray<FormBox<K>>;

    constructor(fields: ReadonlyArray<FormBox<K>>, visitedWhenAllVisited: boolean = true) {
        this.visitedWhenAllVisited = visitedWhenAllVisited;
        this.fields = fields;
    }

    @action setAsVisited() {
        for (const item of this.fields) {
            item.setAsVisited();
        }
    }

    @action reset() {
        for (const item of this.fields) {
            item.reset();
        }
    }

    @computed get modifiedStatus(): boolean {
        for (const item of this.fields) {
            if (item.modifiedStatus) {
                return true;
            }
        }

        return false;
    }

    @computed get isVisited(): boolean {

        if (this.visitedWhenAllVisited) {
                                                        //wszystkie musza być odwiedzone żeby ta grupa była traktowana jako odwiedzona
            for (const item of this.fields) {
                if (item.isVisited === false) {
                    return false;
                }
            }

            return true;
        } else {
            for (const item of this.fields) {
                if (item.isVisited === true) {
                    return true;
                }
            }

            return false;
        }
    }
}
