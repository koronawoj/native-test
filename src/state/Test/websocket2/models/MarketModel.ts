import { SelectionModel } from './SelectionModel/SelectionModel';
import { EventModel } from './EventModel';
import { ModelBoxContext } from '../common/ModelBoxContext';
import { LazyComputed, compareArrays } from '../common/LazyComputed';
import { MarketModelType, MarketTemplateModelType, EachWayType } from '../modelsApi/Market';
import { MobxValue } from '../../utils/MobxValue';

/*
template:
    eventTemplateId: "match"
    id: "jqxxchsh-tfqr5t21"
    name: "Winning Margin"
    sportId: "football"
*/

export class MarketModel {
    private readonly modelBoxContext: ModelBoxContext;
    private readonly model: MobxValue<MarketModelType>;

    //TODO - to remove in near future
    get data(): MarketModelType {
        return this.model.getValue();
    }

    //private fieldForecastsOffered: LazyComputed<boolean | undefined | null>;

    private computedDisplayed: LazyComputed<boolean>;
    private computedSelections: LazyComputed<Array<SelectionModel>>;
    private computedSelectionFilterByAwayTemplate: LazyComputed<Array<SelectionModel>>;
    private computedSelectionFilterByActive: LazyComputed<Array<SelectionModel>>;
    private computedSelectionFilterByHomeTemplate: LazyComputed<Array<SelectionModel>>;

    constructor(modelBoxContext: ModelBoxContext, model: MobxValue<MarketModelType>) {
        this.modelBoxContext = modelBoxContext;
        this.model = model;

        this.computedDisplayed = LazyComputed.create(() => {
            if (this.getData().display === true) {
                return true;
            }

            for (const selectionId of this.selectionsIds) {
                const selectionModel = this.modelBoxContext.getSelection(selectionId);

                if (selectionModel !== null && selectionModel.display) {
                    return true;
                }
            }
            return false;
        });

        this.computedSelections = LazyComputed.create(() => {
            const out = [];

            for (const id of this.getData().selections) {
                const item = this.modelBoxContext.getSelection(id);
                if (item !== null) {
                    out.push(item);
                }
            }

            return out;
        }, compareArrays);

        this.computedSelectionFilterByAwayTemplate = new LazyComputed((): Array<SelectionModel> => {
            return this.selections.filter(selection => {
                return selection.templateId === 'A';
            });
        }, compareArrays);

        this.computedSelectionFilterByActive = new LazyComputed((): Array<SelectionModel> => {
            return this.selections.filter(selection => {
                return selection.shouldDisplay;
            });
        }, compareArrays);

        this.computedSelectionFilterByHomeTemplate = new LazyComputed((): Array<SelectionModel> => {
            return this.selections.filter(selection => {
                return selection.templateId === 'H';
            });
        }, compareArrays);
    }

    getData(): MarketModelType {
        return this.model.getValue();
    }

    getRawData(): MarketModelType {
        return this.getData();
    }

    get id(): number {
        return this.getData().id;
    }

    get uuid(): string | null {
        return this.getData().uuid ?? null;
    }

    get displayed(): boolean {
        return this.computedDisplayed.get();
    }

    get template(): MarketTemplateModelType {
        return this.getData().template;
    }

    get templateId(): string {
        return this.getData().template.id;
    }

    get name(): string {
        return this.getData().name;
    }

    private getTag(name: string): string | undefined {
        const tags = this.getData().tags;
        return tags[name];
    }

    get websiteMain(): boolean {
        const websiteMain = this.getTag('website-main');
        return websiteMain === 'yes';
    }

    get websiteNotPopular(): boolean {
        const websitetPopular = this.getTag('website-popular');
        return !(websitetPopular === '-');
    }

    get displayOrderTag(): string | undefined {
        return this.getTag('display-order');
    }

    get isSpecialTag(): string | undefined {
        return this.getTag('is-special');
    }

    get marketGroupRacWinnerTag(): string | undefined {
        return this.getTag('market-group--race-winner');
    }

    get antePostTag(): string | undefined {
        return this.getTag('ante-post');
    }


    get trapChallengeTag(): string | undefined {
        return this.getTag('trap-challenge');
    }

    get selectionsIds(): Array<number> {
        return this.getData().selections;
    }

    get tagsAntePost(): string | undefined {
        return this.getTag('ante-post');
    }

    get tagsGolfMarketType(): string | undefined {
        return this.getTag('golf-market-type');
    }

    get selections(): Array<SelectionModel> {
        return this.computedSelections.get();
    }

    get activeSelections(): Array<SelectionModel> {
        return this.computedSelectionFilterByActive.get();
    }

    get selectionFilterByAwayTemplate(): Array<SelectionModel> {
        return this.computedSelectionFilterByAwayTemplate.get();
    }

    get selectionFilterByHomeTemplate(): Array<SelectionModel> {
        return this.computedSelectionFilterByHomeTemplate.get();
    }

    get tradedInPlay(): boolean {
        return this.getData().tradedInPlay;
    }

    get spOnly(): boolean {
        return this.getData().spOnly;
    }

    get sp(): boolean {
        return this.getData().sp;
    }

    get bp(): boolean {
        return this.getData().bp;
    }

    get marketName(): string {
        return this.name;
    }

    get display(): boolean {
        const value = this.getData().display;
        if (value === true) {
            return true;
        }

        return false;
    }

    get displayOrder(): number {
        return this.getData().displayOrder;
    }

    get isTotalGoalsOverUnder(): boolean {
        return 'total-goals-over-under' === this.templateId;
    }

    get isCorrectScore(): boolean {
        return ['correct-score', 'half-time-correct-score'].includes(this.templateId);
    }

    get isOutright(): boolean {
        return ['outrights', 'custom-outrights-market'].includes(this.templateId);
    }

    get isGoalscorer(): boolean {
        return ['first-goalscorer', 'anytime-goalscorer','hattrick-goalscorer'].includes(this.templateId);
    }

    get displayTemplate(): string | undefined {                           //TODO - change to private
        return this.getTag('display-template');
    }

    get displayTemplateFirst(): string | undefined {
        return this.displayTemplate;
    }

    get groupTemplate(): string | undefined {
        return this.getTag('group-template');
    }

    get groupTemplateFirst(): string | undefined {
        return this.groupTemplate;
    }

    get eachWay(): EachWayType | undefined {
        return this.getData().eachWay;
    }

    get eachWayOffered(): boolean {
        const eachWay = this.eachWay;
        if (eachWay) {
            return eachWay.offered;
        }

        return false;
    }

    get eachWayTermsPlaces(): number | undefined {
        const eachWay = this.eachWay;

        if (eachWay) {
            const termsItem = eachWay.terms[0];

            if (termsItem !== undefined) {
                return termsItem.places;
            }
        }

        return undefined;
    }

    get eachWayTermsReduction(): string | undefined {
        const eachWay = this.eachWay;

        if (eachWay) {
            const termsItem = eachWay.terms[0];

            if (termsItem !== undefined) {
                return termsItem.reduction;
            }
        }

        return undefined;
    }

    /*
    const ew = market.get('eachWay');
    const terms = ew.getIn([ 'terms', 0 ]) || Map();
    terms.get('places')
    */

    get tricastsOffered(): boolean {
        const tricastsOffered = this.getData().tricastsOffered;
        return tricastsOffered === true ? true : false;
    }

    get forecastsOffered(): boolean {
        const forecastsOffered = this.getData().forecastsOffered;
        return forecastsOffered === true ? true : false;
    }

    get cashoutAvailable(): boolean {
        const cashoutAvailable = this.getData().cashoutAvailable;
        return cashoutAvailable === true ? true : false;
    }

    get active(): boolean {
        return this.getData().active;
    }

    get eventId(): number {
        return this.getData().event.id;
    }

    get eventModel(): EventModel | null {
        return this.modelBoxContext.getEvent(this.eventId);
    }

    getEvent(): EventModel | null {
        return this.modelBoxContext.getEvent(this.eventId);
    }

    get activated(): boolean {
        const parentEvent = this.eventModel;

        if (parentEvent !== null) {
            return parentEvent.active && this.active;
        }

        return false;
    }

    get line(): number | null {
        const value = this.getData().line;

        if (value === undefined) {
            return null;
        }

        return value;
    }

    get activeAndDisplayed(): boolean {
        return this.display === true && this.active === true;
    }
}
