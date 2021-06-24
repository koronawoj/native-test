
interface ConfigType {
    readonly apiEventListIncludes: () => Record<string, string[]>,
    readonly oddsFormatShort: () => 'f' | 'd' | 'a',
    readonly selectionViewPriceFixed: () => boolean,
}

export class ModelsStateSocketConfig {

    public constructor(private readonly config: ConfigType) {}

    public get apiEventListIncludes(): Record<string, string[]> {
        return this.config.apiEventListIncludes();
    }

    public get oddsFormatShort(): 'f' | 'd' | 'a' {
        return this.config.oddsFormatShort();
    }

    public get selectionViewPriceFixed(): boolean {
        return this.config.selectionViewPriceFixed();
    }
}

