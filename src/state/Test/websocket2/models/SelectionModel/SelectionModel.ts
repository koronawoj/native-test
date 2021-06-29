import { EventModel } from '../EventModel';
import { MarketModel } from '../MarketModel';
import { SelectionViewModel } from './SelectionViewModel';
import { SelectionAnimation } from './SelectionAnimation';
import { ModelBoxContext } from '../../common/ModelBoxContext';
import { SelectionApiModelType, PriceType as PriceTypeApi, PriceHistoryItemType, SelectionModelType } from '../../modelsApi/Market';
import { MobxValue } from '../../../utils/MobxValue';

export type PriceType = PriceTypeApi;

export class SelectionModel {
    private readonly record: MobxValue<SelectionModelType>;
    private readonly modelBoxContext: ModelBoxContext;
    private readonly animation: SelectionAnimation;

    public constructor(modelBoxContext: ModelBoxContext, animation: SelectionAnimation, record: MobxValue<SelectionModelType>) {
        this.modelBoxContext = modelBoxContext;
        this.animation = animation;
        this.record = record;
    }

    public getData(): SelectionModelType {
        return this.record.getValue();
    }

    public getRawData(): SelectionApiModelType {
        return this.record.getValue();
    }

    public get computedSelectionIdentifiers(): string | undefined {
        const tags = this.getData().tags;

        for (const [key, tag] of Object.entries(tags)) {
            if (key.includes('selection-identifiers')) {
                return tag;
            }
        }
    }

    public get computedMetaData(): undefined | Record<string, string | null | undefined> {
        const event = this.getEvent();

        if (event !== null) {
            const participants = event.participants;

            for (const item of Object.values(participants)) {
                if (item.name === this.name) {
                    return item.metadata;
                }
            }
        }
    }

    public get participantId(): number | null {
        const event = this.getEvent();

        if (event !== null) {
            const participants = event.participants;

            for (const item of Object.values(participants)) {
                if (item.name === this.name) {
                    return item.id;
                }
            }
        }

        return null;
    }

    public get id(): number {
        return this.getData().id;
    }

    public get uuid(): string | null {
        return this.getData().uuid ?? null;
    }

    public get selectionIdentifiers(): string | undefined {
        return this.computedSelectionIdentifiers;
    }

    public get display(): boolean {
        const display = this.getData().display;
        return display === true ? true : false;
    }

    public get eventId(): number {
        return this.getData().eventId;
    }

    public getEvent(): EventModel | null {
        const eventId = this.eventId;
        return this.modelBoxContext.getEvent(eventId);
    }

    public get marketId(): number {
        return this.getData().marketId;
    }

    public get spOnly(): boolean | void {
        const parentMarket = this.getMarket();

        if (parentMarket !== null) {
            return parentMarket.spOnly;
        }

        return false;
    }

    public get displayOrder(): number| undefined {
        return this.getData().displayOrder;
    }

    public getMarket(): MarketModel | null {
        const marketId = this.marketId;
        return this.modelBoxContext.getMarket(marketId);
    }

    public isEventStarted(): boolean {
        const event = this.getEvent();

        if (event !== null) {
            return event.timeSettingsStarted;
        }

        return false;
    }

    public get price(): PriceType | undefined {
        const price = this.getData().price;
        if (price === null) {
            return undefined;
        }

        return price;
    }

    public get oldPrice(): PriceType | undefined {
        const priceHistory = this.getData().priceHistory;

        if (priceHistory !== null && priceHistory !== undefined) {
            const priceModel = priceHistory[0];

            if (priceModel !== undefined) {
                const price = {
                    ...priceModel.p,
                    empty: undefined
                };

                return price;
            }
        }

        return undefined;
    }

    public get resultType(): string | undefined | null {
        return this.getData().result?.type;
    }

    public get sp(): boolean {
        return this.getMarket()?.sp ?? false;
    }

    public get isSP(): boolean {
        const parentEvent = this.getEvent();
        if (parentEvent !== null) {
            return this.sp && parentEvent.timeSettingsStarted !== true;
        }

        return false;
    }

    public get shouldDisplay(): boolean {

        return this.display && this.active;
    }

    public get templateId(): string | undefined {
        const template = this.getData().template;

        if (template !== undefined) {
            return template.id;
        }

        return undefined;
    }

    public get templateMarketId(): string | void {
        const template = this.getData().template;

        if (template !== undefined) {
            return template.marketTemplateId;
        }

        return undefined;
    }

    public get active(): boolean {
        return this.getData().active ?? false;
    }

    public get activated(): boolean {
        const parentMarket = this.getMarket();

        if (parentMarket !== null) {
            return parentMarket.activated && this.active;
        }

        return false;
    }

    private forViewModel(sp?: boolean): SelectionViewModel | null {
        const eventModel = this.getEvent();
        if (eventModel === null) {
            return null;
        }

        const marketModel = this.getMarket();
        if (marketModel === null) {
            return null;
        }

        return new SelectionViewModel(this.modelBoxContext, eventModel, marketModel, this, sp, this.animation);
    }

    public forView(sp?: boolean) : SelectionViewModel | null {
        return this.forViewModel(sp);
    }

    public get name() : string {
        return this.getData().name ?? '';
    }

    public get state(): string {
        const fieldState = this.getData().state;
        return fieldState !== undefined ? fieldState : '';
    }

    public get isMetaData(): boolean {
        const metaData = this.computedMetaData;
        if (metaData === undefined) {
            return false;
        }
        return true;
    }

    public get metaDataSilkUrl(): string | undefined | null {
        const metaData = this.computedMetaData;

        if (metaData !== undefined) {
            const silkuri = metaData.silkuri;

            if (typeof silkuri === 'string') {
                if (silkuri.includes('sportingsolutions')) {
                    const parts = silkuri.split('/');

                    const chunk1 = parts[3];
                    const chunk2 = parts[5];
                    const chunk3 = parts[6];
                    const chunk4 = parts[7];

                    if (chunk1 !== undefined && chunk2 !== undefined && chunk3 !== undefined && chunk4 !== undefined) {
                        return `/api-web/silks/${chunk1}/${chunk2}/${chunk3}/${chunk4}`;
                    }

                    //return `/api-web/silks/${parts[3]}/${parts[5]}/${parts[6]}/${parts[7]}`;
                }
            }

            return silkuri;
        }
    }

    public get metaDataSilk(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.silk;
        }
    }

    public get metaDataJockey(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.jockey;
        }
    }

    public get metaDataTrainer(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.trainer;
        }
    }

    public get metaDataNumber(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.number;
        }
    }

    public get metaDataDrawn(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.drawn;
        }
    }

    public get marketDisplayTemplate(): string | undefined {
        const market = this.getMarket();
        if (market !== null) {
            return market.displayTemplateFirst;
        }
    }

    public get marketDisplayOrder(): number | undefined {
        const market = this.getMarket();
        if (market !== null) {
            return market.displayOrder;
        }
    }

    public get marketSelectionOrdering(): string | undefined {
        const market = this.getMarket();
        if (market !== null) {
            return market.displayOrderTag;
        }
    }

    public get identifier(): string | undefined {
        return this.selectionIdentifiers;
    }

    public get metaDataWeight(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.weight;
        }
    }

    public get metaDataCourseType(): string | undefined | null {
        const metaData = this.computedMetaData;
        if (metaData !== undefined) {
            return metaData.courseType;
        }
    }

    public get priceHistory(): Array<PriceHistoryItemType> {
        return this.getData().priceHistory ?? [];
    }

    public getTag(name: string): string | null {
        const tags = this.getData().tags;
        return tags[name] ?? null;
    }
}
