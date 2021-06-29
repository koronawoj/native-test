import moment from 'moment';
import { MarketModel } from './MarketModel';
import { ModelBoxContext } from '../common/ModelBoxContext';
import { LazyComputed, compareArrays } from '../common/LazyComputed';
import { EventModelType as EventModelType, ParticipantModelType, StreamType } from '../modelsApi/Event';
import { parseScore, SingleScoreType } from './parseScore';
import { MobxValue } from '../../utils/MobxValue';
import { EventMarketItemType } from '../modelsApi/EventMarkets';
// import { Resource } from '../../utils/Resource';

// const ScoreValueIO = t.interface({
//     home: t.union([t.number, t.string]),
//     away: t.union([t.number, t.string]),
// });

// export type ScoreValueType = t.TypeOf<typeof ScoreValueIO>;

export type ScoreValueType = {
    home: number | string,
    away: number | string,
}

//get score(): Array<{ home: number, away: number}>,

// const ScoreIO = t.union([
//     t.interface({
//         formatted: t.string, // to remove
//         value: t.array(ScoreValueIO),
//         set: t.union([t.string, t.undefined])
//     }),
//     t.null
// ]);

export type ScoreType = {
    formatted: string,
    value: Array<ScoreValueType>,
    set?: string
};

export class EventModel {
    private readonly modelBoxContext: ModelBoxContext;

    private readonly model: MobxValue<EventModelType>;

    // private readonly streamResource: Resource<StreamModelType | null>;

    //TODO - to remove in near future
    private get data(): EventModelType {
        return this.model.getValue();
    }

    private computedMarketsId: LazyComputed<Array<number>>;
    private computedMarkets: LazyComputed<Array<MarketModel>>;
    private computedAllMarketsLoading: LazyComputed<boolean>;
    private computedMarketsWithWebsiteMain: LazyComputed<Array<MarketModel> | null>;
    private computedMarketFilterByGoalScorer: LazyComputed<Array<MarketModel>>;
    private computedSortedMarketsIds: LazyComputed<Array<number>>;
    private computedTimeSettingsStartTimeUnixMs: LazyComputed<number>;
    private computedMarketRaceWinner: LazyComputed<Array<MarketModel>>;

    private computedTimeSearchFrom: LazyComputed<boolean>;
    private computedTimeMatchInPlay: LazyComputed<boolean>;
    private computedTimeMatchStartedAndFinished: LazyComputed<boolean>;
    private computedTimeMatchToday: LazyComputed<boolean>;
    private computedTimeMatchTomorrow: LazyComputed<boolean>;
    private computedTimeMatchWeekend: LazyComputed<boolean>;
    private computedTimeMatchCurrentWeek: LazyComputed<boolean>;
    private computedTimeMatchNextWeek: LazyComputed<boolean>;
    private computedTimeMatchNextOff: LazyComputed<boolean>;
    private computedTimeMatchUpcoming: LazyComputed<boolean>;

    public constructor(modelBoxContext: ModelBoxContext, model: MobxValue<EventModelType>) {
        this.modelBoxContext = modelBoxContext;
        this.model = model;

        this.computedMarketsId = new LazyComputed<Array<number>>((): Array<number> => {
            const eventMarkets = this.modelBoxContext.getEventMarkets(this.id) ?? [];
            return eventMarkets.map((item) => item.id);
        });

        this.computedMarkets = new LazyComputed<Array<MarketModel>>((): Array<MarketModel> => {
            const eventMarkets = this.modelBoxContext.getEventMarkets(this.id) ?? [];

            const out: Array<MarketModel> = [];

            for (const eventMarketItem of eventMarkets) {
                const item = this.modelBoxContext.getMarket(eventMarketItem.id);
                if (item !== null) {
                    out.push(item);
                }
            }

            return out;
        }, compareArrays);

        this.computedAllMarketsLoading = new LazyComputed((): boolean => {
            const eventMarkets = this.modelBoxContext.getEventMarkets(this.id) ?? [];

            for (const eventMarketItem of eventMarkets) {
                const item = this.modelBoxContext.getMarket(eventMarketItem.id);
                if (item === null) {
                    return true;
                }
            }

            return false;
        });

        this.computedMarketsWithWebsiteMain = new LazyComputed((): Array<MarketModel> | null => {
            if (!this.display) {
                return [];
            }

            const eventMarkets = this.modelBoxContext.getEventMarkets(this.id) ?? [];

            const out: Array<MarketModel> = [];
            let loading = false;

            for (const eventMarketItem of eventMarkets) {
                if (eventMarketItem.websiteMain) {
                    const item = this.modelBoxContext.getMarket(eventMarketItem.id);
                    if (item === null) {
                        loading = true;
                    } else {
                        out.push(item);
                    }
                }
            }

            if (loading) {
                return null;
            }

            return out;
        });

        this.computedMarketFilterByGoalScorer = new LazyComputed<Array<MarketModel>>((): Array<MarketModel> => {
            return this.markets.filter(market => {
                return market.isGoalscorer;
            });
        }, compareArrays);

        this.computedSortedMarketsIds = new LazyComputed<Array<number>>((): Array<number> => {
            const out = [];

            const sortedMarkets = [...this.markets].sort((a: MarketModel, b:MarketModel) => {
                return a.displayOrder - b.displayOrder || a.name.localeCompare(b.name);
            });

            for (const market of sortedMarkets) {

                const item = this.modelBoxContext.getMarket(market.id);
                if (item !== null) {
                    out.push(item.id);
                }
            }

            return out;
        });

        this.computedMarketRaceWinner = LazyComputed.create(() => {
            const eventMarkets = this.modelBoxContext.getEventMarkets(this.id) ?? [];

            const markets: Array<MarketModel> = [];

            for (const eventMarketItem of eventMarkets) {
                const item = this.modelBoxContext.getMarket(eventMarketItem.id);
                if (item !== null) {
                    markets.push(item);
                }
            }

            return markets.filter((x: MarketModel): boolean => {
                const templateId = x.templateId;
                const raceWinnerTag = x.marketGroupRacWinnerTag;
                const antePostTag = x.antePostTag;
                const oldMarketFiltering = !this.antePost && templateId === 'race-winner' && antePostTag !== 'yes';

                return (raceWinnerTag === 'yes' || oldMarketFiltering ) && x.displayed;
            });
        });

        this.computedTimeSettingsStartTimeUnixMs = LazyComputed.create(() => {
            return moment(this.timeSettingsStartTime).utc().unix() * 1000;
        });

        this.computedTimeSearchFrom = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.searchFrom() <= this.timeSettingsStartTimeUnixMs;
        });

        this.computedTimeMatchInPlay = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.inPlay.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchStartedAndFinished = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.startedAndFinished.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchToday = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.today.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchTomorrow = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.tomorrow.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchWeekend = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.weekend.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchCurrentWeek = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.currentWeek.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchNextWeek = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.nextWeek.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchNextOff = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.nextOff.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        this.computedTimeMatchUpcoming = LazyComputed.create(() => {
            return this.modelBoxContext.serverTime.upcoming.matchMs(this.timeSettingsStartTimeUnixMs);
        });

        /*
        this.streamResource = new Resource(async () => {
            if (this.data.stream !== undefined && this.data.stream !== null) {
                const streamData = arrayGet(this.stream, 0);
                const streamId = streamData?.id;
                const provider = streamData?.provider;
                if (streamId !== undefined && provider !== undefined) {
                    if (provider === "ATR"){
                        const response = await apiCommon.getAtrStream.run({id: streamId});
                        const streamsNumber = response.streams?.length;
                        if (response.streams !== null && streamsNumber !== undefined) {
                            const lastStreamSource = arrayGet(response.streams, streamsNumber - 1);
                            return lastStreamSource ?? null;
                        }
                    }
                    const innerWidth = getWindowInnerWidth();
                    const isMobile = innerWidth !== null && innerWidth < 1024;
                    return apiCommon.getRMGStream.run({id: streamId, isMobile});
                }
            }
            return null;
        });
        */

        // this.streamResource = new Resource(async () => {
        //     return await this.getStream();
        // });
    }

    public get streamList(): Array<StreamType> {
        const stream = this.data.stream;

        if (stream === undefined || stream === null) {
            return [];
        }
        return stream;
    }

    public getData(): EventModelType {
        return this.model.getValue();
    }

    public getRawData(): EventModelType {
        return this.getData();
    }

    public get id(): number {
        return this.getData().id;
    }

    public get uuid(): string | null {
        return this.getData().uuid ?? null;
    }

    public get name(): string {
        return this.getData().name;
    }

    public get competition(): number {
        return this.getData().competition;
    }

    public get sport(): string {
        return this.getData().sport;
    }

    public get sportOriginal(): string {
        return this.getData().sportOriginal;
    }

    public get template(): string {
        return this.getData().template;
    }

    private getTag(name: string): string | undefined {
        const tags = this.getData().tags;
        return tags[name];
    }

    public get markets(): Array<MarketModel> {
        return this.computedMarkets.get();
    }

    public get eventMarkets(): Array<EventMarketItemType> | null {
        return this.modelBoxContext.getEventMarkets(this.id);
    }

    public get marketRaceWinner(): Array<MarketModel> {
        return this.computedMarketRaceWinner.get();
    }

    public get allMarketsForEventPage(): Array<MarketModel> {
        return this.computedMarkets.get();
    }

    public get allMarketsLoading(): boolean {
        return this.computedAllMarketsLoading.get();
    }

    public get marketsWithWebsiteMain(): Array<MarketModel> | null {
        return this.computedMarketsWithWebsiteMain.get();
    }

    public get sortedMarketsIds(): Array<number> {
        return this.computedSortedMarketsIds.get();
    }

    public get marketsIds(): number[] {
        return this.computedMarketsId.get();
    }

    public get participants(): Record<string, ParticipantModelType> {
        return this.getData().participants;
    }

    public get tagsRegion(): string | undefined {
        return this.getTag('region');
    }

    public get tagsCountry(): string | undefined {
        return this.getTag('country');
    }

    public get tagsOutright(): string | undefined {
        return this.getTag('outright');
    }

    public get tagsDisplayOrder(): string | undefined {
        return this.getTag('display-order');
    }

    public get tagsAntePost(): string | undefined {
        return this.getTag('ante-post');
    }

    public get tagsLayout(): string | undefined {
        return this.getTag('layout');
    }

    public get tagsShowBannerOnWidget(): string | undefined {
        return this.getTag('show-banner-on-widget');
    }

    public get tagsShowBannerOnEventPage(): string | undefined {
        return this.getTag('show-banner-on-event-page');
    }

    public get tagsShowVideoStream(): string | undefined {
        return this.getTag('show-video-stream');
    }

    public get tagsShowWidget(): string | undefined {
        return this.getTag('show-widget');
    }

    public get tagsIsPartOfLayout(): boolean {
        return this.getTag('is-part-of-layout') === 'yes';
    }

    public get isFeedData(): boolean {
        const feedData = this.getData().feedData;
        if (feedData === undefined) {
            return false;
        }
        return true;
    }

    private getFromFeedData(key: string): string | undefined {
        const feedData = this.getData().feedData;
        if (feedData) {
            const value = feedData[key];

            if (typeof value === 'string') {
                return value;
            }
        }
    }

    public get feedDataGoing(): string | undefined {
        return this.getFromFeedData('going');
    }

    public get feedCourseType(): string | undefined {
        return this.getFromFeedData('courseType');
    }

    public get feedHandicap(): string | undefined {
        return this.getFromFeedData('handicap');
    }

    public get feedDistance(): string | undefined {
        return this.getFromFeedData('distance');
    }

    public get feedSurface(): string | undefined {
        return this.getFromFeedData('surface');
    }

    public get feedId(): string | undefined | null {
        const feedData = this.getData().feedData;
        if (feedData) {
            return feedData.feedId;
        }
    }

    public get feedGroupId(): string | undefined | null {
        const feedData = this.getData().feedData;
        if (feedData) {
            return feedData.groupId;
        }
    }

    public get timeSettingsStartTime(): string {
        return this.getData().timeSettings.startTime;
    }

    public get timeSettingsStarted(): boolean {
        return this.getData().timeSettings.started;
    }

    public get timeSettingsTradedInPlay(): boolean {
        return this.getData().timeSettings.tradedInPlay;
    }

    public get timeSettingsTimeZone(): string {
        return this.getData().timeSettings.timeZone;
    }

    public get timeSettingsTimeline(): string | undefined | null {
        //return this.getData().timeSettings.timeLineState ? this.getData().timeSettings.timeLineState : this.getData().timeSettings.timeline;
        return this.getData().timeSettings.timeLineState ?? this.getData().timeSettings.timeline;
    }

    public get score(): Array<SingleScoreType> {
        return parseScore(this.getData().statistics);
    }

    public get scoreHome(): number | null {
        const score = this.score[0];

        if (score !== undefined) {
            return score.home;
        }

        return null;
    }

    public get scoreAway(): number | null {
        const score = this.score[0];

        if (score !== undefined) {
            return score.away;
        }

        return null;
    }

    public get scoreFormatted(): string | null {
        const scoreHome = this.scoreHome;
        const scoreAway = this.scoreAway;

        if (scoreHome !== null && scoreAway !== null) {
            return `${scoreHome}-${scoreAway}`;
        }

        return null;
    }

    public get marketFilterByGoalScorer(): Array<MarketModel> {
        return this.computedMarketFilterByGoalScorer.get();
    }

    // Now we don't receive information about sets
    // public get scoreSet(): string | undefined {
    //     const score = this.score;

    //     if (score !== null) {
    //         return score.set;
    //     }

    //     return undefined;
    // }

    public get active(): boolean {
        return this.getData().active;
    }

    public get display(): boolean {
        return this.getData().display;
    }

    public get state(): string {
        return this.getData().state;
    }

    public get homeParticipant(): string | null {

        for (const participant of Object.values(this.participants)) {
            if (participant.role === 'home') {
                return participant.name !== undefined ? participant.name : null;
            }
        }
        return null;
    }

    public get awayParticipant(): string | null {
        for (const participant of Object.values(this.participants)) {
            if (participant.role === 'away') {
                return participant.name !== undefined ? participant.name : null;
            }
        }
        return null;
    }

    public get antePost(): boolean {
        return this.getData().antePost;
    }

    public get timeSettingsStartTimeUnixMs(): number {
        return this.computedTimeSettingsStartTimeUnixMs.get();
    }

    public get timeSearchFrom(): boolean {
        return this.computedTimeSearchFrom.get();
    }

    public get timeMatchInPlay(): boolean {
        return this.computedTimeMatchInPlay.get();
    }

    public get timeMatchStartedAndFinished(): boolean {
        return this.computedTimeMatchStartedAndFinished.get();
    }

    public get timeMatchToday(): boolean {
        return this.computedTimeMatchToday.get();
    }

    public get timeMatchTomorrow(): boolean {
        return this.computedTimeMatchTomorrow.get();
    }

    public get timeMatchWeekend(): boolean {
        return this.computedTimeMatchWeekend.get();
    }

    public get timeMatchCurrentWeek(): boolean {
        return this.computedTimeMatchCurrentWeek.get();
    }

    public get timeMatchNextWeek(): boolean {
        return this.computedTimeMatchNextWeek.get();
    }

    public get timeMatchNextOff(): boolean {
        return this.computedTimeMatchNextOff.get();
    }

    public get timeMatchUpcoming(): boolean {
        return this.computedTimeMatchUpcoming.get();
    }

    public get raceHasBp(): boolean {
        for (const market of this.markets) {
            if (market.bp) {
                return true;
            }
        }

        return false;
    }

    // public get stream(): Array<StreamType> {
    //     const streamForView = this.streamForView;

    //     if (streamForView === null) {
    //         return [];
    //     }

    //     return [streamForView];
    // }

    public get showCashoutIcon(): boolean {
        return this.timeMatchInPlay || this.timeSettingsTimeline === 'Prematch';
    }

    // public get streamUrl(): {type: 'loading'} | {type: 'ready', url: string | null} | null {
    //     const res = this.streamResource.get();

    //     if (res.type === 'ready') {
    //         return {
    //             type: 'ready',
    //             url: res.value?.url ?? null };
    //     }

    //     if (res.type === 'loading') {
    //         return { type: 'loading' };
    //     }

    //     return null;
    // }

    // private operatorNameArray(): Array<string> {
    //     return this.stream.map(provider => provider.provider);
    // }

    // public get providerName(): string | undefined {
    //     return this.operatorNameArray().join();
    // }

    // public refreshStreamingResource = (): void => {
    //     this.streamResource.refresh();
    // }

    public get lsportExternalId(): string | null {
        /*
        Example for LSport:

        platformObject": {
            "externalId":{
                "feedId": null
                "instance": "star"
                "provider": "lsports"
            }
            "id": "lsports_6292771"
            "name": "Cannon Kingsley vs Garrett Johns"
        }
        */

        const platformObject = this.data.platformObject ?? null;

        if (platformObject === null) {
            return null;
        }

        const platformObjectId = platformObject.id ?? null;

        if (platformObjectId === null) {
            return null;
        }

        const chunks = platformObjectId.split('_');

        if (chunks.length !== 2) {
            return null;
        }

        const prefix = chunks[0];
        const id = chunks[1];

        if (prefix === undefined || id === undefined) {
            return null;
        }

        if (prefix === 'lsports') {
            return id;
        }

        return null;
    }
}
