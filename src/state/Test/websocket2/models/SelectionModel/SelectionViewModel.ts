import { SelectionModel, PriceType } from './SelectionModel';
import { EventModel } from '../EventModel';
import { MarketModel } from '../MarketModel';
import { computed } from 'mobx';

import { SelectionAnimation } from './SelectionAnimation';
import { ModelBoxContext } from '../../common/ModelBoxContext';
import { calculateAmericanOdds } from '../../common/calculateAmericanOdds';

interface Params {
    selection: SelectionModel,
    sp?: boolean,
    started: boolean,
    tradedInPlay: boolean,
    isSPOnly: boolean,
}

interface StateReturn {
    price: 'sp' | PriceType | undefined;
    suspended: boolean;
    selected: boolean;
}

const buildState = ({ selection, sp, started, tradedInPlay, isSPOnly }: Params): StateReturn => {
    let price: 'sp' | PriceType | undefined;
    let suspended = false;

    const isSP = selection.sp && started !== true;
    const isUnnamedFavourite = selection.templateId === 'unnamed-favourite';

    if (isUnnamedFavourite && isSP) {
        if (sp !== false) {
            price = 'sp';
        }
    } else if (sp === true) {
        if (isSP) {
            price = 'sp';
        }
    } else if (selection.price !== undefined && !isSPOnly && selection.activated) {
        price = selection.price;
    } else if (isSP) {
        price = 'sp';
    }

    if (sp === true && isSP) {
        suspended = started === true;
    } else {
        suspended = !isSPOnly && !isSP && (!selection.activated || (tradedInPlay === false && started === true));
    }

    return {
        price,
        suspended,
        selected: false
    };
};

export class SelectionViewModel {
    public readonly modelBoxContext: ModelBoxContext;
    public readonly event: EventModel;
    public readonly market: MarketModel;
    public readonly selection: SelectionModel;
    public readonly sp: boolean | undefined;
    public readonly animation: SelectionAnimation;

    public constructor(modelBoxContext: ModelBoxContext, event: EventModel, market: MarketModel, selection: SelectionModel, sp: boolean | undefined, animation: SelectionAnimation) {
        this.modelBoxContext = modelBoxContext;
        this.event = event;
        this.market = market;
        this.selection = selection;
        this.sp = sp;
        this.animation = animation;
    }

    @computed.struct public get forView(): StateReturn {
        const marketTradedInPlay = this.market.tradedInPlay;
        const isSPOnly = this.market.spOnly;

        const started = this.event.timeSettingsStarted;
        const tradedInPlay = this.event.timeSettingsTradedInPlay && marketTradedInPlay;

        return buildState({
            selection: this.selection,
            started,
            tradedInPlay,
            isSPOnly,
            sp: this.sp
        });
    }

    @computed.struct public get price(): 'sp' | PriceType | undefined {
        return this.forView.price;
    }

    @computed.struct public get suspended(): boolean {
        return this.forView.suspended;
    }

    @computed.struct public get selected(): boolean {
        return this.forView.selected;
    }

    @computed public get displayPrice(): string | number {
        const selectionViewPriceFixed = this.modelBoxContext.modelsStateSocketConfig.selectionViewPriceFixed;
        const oddsFormat = this.modelBoxContext.modelsStateSocketConfig.oddsFormatShort;

        if (this.price === undefined) {
            return '-';
        }

        if (this.price === 'sp') {
            return 'SP';
        }

        if (oddsFormat === 'a') {
            return calculateAmericanOdds(this.price.d);
        }

        if (oddsFormat === 'd') {
            return selectionViewPriceFixed ? this.price.d.toFixed(2) : this.price.d;
        }

        if (oddsFormat === 'f') {
            return this.price.f;
        }

        return '';
    }

    @computed public get priceChange(): 'up' | 'down' | null {
        return this.animation.priceChange;
    }
}
