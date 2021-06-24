import { action, computed, IObservableValue, observable } from "mobx";
import { createContext, useContext } from "react";
import { TestState, } from "./Test/TestState";
export class AppState {
    public readonly testState: TestState;
    
    @observable count: number = 0;

    constructor() {
        this.testState = new TestState();
    }

    @action increment = () => {
        this.count += 1;
    }

    @action decrement = () => {
        this.count -= 1;
    }

    @computed get event() {
        return this.testState.test;
    }
}

export const AppStateContext = createContext<AppState | undefined>(undefined);

export function useAppState() {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useRootStore must be used within RootStoreProvider');
    }
    return context;
}