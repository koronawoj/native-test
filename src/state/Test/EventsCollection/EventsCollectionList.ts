import { computed } from 'mobx';
import { ModelsState } from '../websocket2/ModelsState';
import { EventModel } from '../websocket2/models/EventModel';
import { CompetitionType, EventsCollectionQueryModel } from '../websocket2/models/EventsCollectionQueryModel';
import { ServerTimeState } from '../websocket2/ServerTimeState';
import { EventListGroupEventItemType } from '../websocket2/modelsApi/EventsCollectionQuery';

export enum DownloadStatusEnum {
    PROGRESS = 'PROGRESS',
    ERROR = 'ERROR',
    READY = 'READY',
}

export type CompetitionItemViewType = {
    id: number,
    name: string,
};

/**
 * @deprecated
 * This class should be remove in near future
 */
export class EventsCollectionList {
    private readonly serverTime: ServerTimeState;
    private readonly modelsState: ModelsState;
    private readonly getQuery: () => EventsCollectionQueryModel | null

    public constructor(serverTime: ServerTimeState, modelsState: ModelsState, getQuery: () => EventsCollectionQueryModel | null) {
        this.serverTime = serverTime;
        this.modelsState = modelsState;
        this.getQuery = getQuery;
    }

    @computed public get collectionQuery(): EventsCollectionQueryModel {
        const collectionQuery = this.getQuery();

        if (collectionQuery !== null) {
            return collectionQuery;
        }

        return EventsCollectionQueryModel.createEmpty(this.serverTime);
    }

    @computed public get isEmpty(): boolean | null {
        return this.collectionQuery.isEmpty;
    }

    @computed public get length(): number {
        return this.ids.length;
    }

    @computed.struct public get ids(): Array<number> {
        const result = this.getQuery();

        if (result === null) {
            return [];
        }
        return result.ids;
    }

    @computed public get status(): DownloadStatusEnum {  
        const list = this.getQuery();

        if (list === null) {
            return DownloadStatusEnum.PROGRESS;
        }

        return DownloadStatusEnum.READY;
    }

    public get total(): number {
        return this.ids.length;
    }

    @computed public get isLoading(): boolean {
        return this.status === DownloadStatusEnum.PROGRESS;
    }

    /**
     * @deprecated
     */
    @computed public get events(): Array<EventModel> {
        const out: Array<EventModel> = [];

        for (const id of this.ids) {
            const event = this.modelsState.getEvent(id);

            if (event !== null) {
                out.push(event);
            }
        }

        return out;
    }

    @computed.struct public get competitionIds(): Array<number> {
        return this.collectionQuery.competitionIds;
    }

    @computed.struct public get competitionIdsByDisplayOrder(): Array<number> {
        return this.collectionQuery.competitionIdsByDisplayOrder;
    }

    @computed.struct public get competitionIdsByDisplayOrderAndDay(): Array<CompetitionType> {
        return this.collectionQuery.competitionIdsByDisplayOrderAndDay;
    }

    @computed public get competitionForView(): Array<CompetitionItemViewType> {
        return this.collectionQuery.competitionForView;
    }

    @computed public get competitionForViewSortByName(): Array<CompetitionItemViewType> {
        return this.collectionQuery.competitionForViewSortByName;
    }

    @computed.struct public get sportsIds(): Array<string> {
        return this.collectionQuery.sportsIds;
    }

    @computed.struct public get regionIds(): Array<string> {
        return this.collectionQuery.regionIds;
    }

    @computed.struct public get countryIds(): Array<string> {
        return this.collectionQuery.countryIds;
    }

    public filterBySportAndEvent(filter: (sport: string, event: EventListGroupEventItemType) => boolean): EventsCollectionList {
        return new EventsCollectionList(
            this.serverTime,
            this.modelsState,
            () => this.collectionQuery.filterBySportAndEvent(filter)
        );
    }

    public filterByCompetition(filter: (competitionId: number) => boolean): EventsCollectionList {
        return new EventsCollectionList(
            this.serverTime,
            this.modelsState,
            () => this.collectionQuery.filterByCompetition(filter)
        );
    }

    public limit(limit: number): EventsCollectionList {
        return new EventsCollectionList(
            this.serverTime,
            this.modelsState,
            () => this.collectionQuery.limit(limit)
        );
    }
}
