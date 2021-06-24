import { MobxValue } from '../../utils/MobxValue';
import {
    EventListGroupType,
    EventListGroupSportItemType,
    EventListGroupCompetitionItemType,
    EventListGroupEventItemType,
} from '../../websocket2/modelsApi/EventsCollectionQuery';
import { computed } from 'mobx';
import { ServerTimeState } from '../../websocket2/ServerTimeState';

export interface EventsCollectionQueryCompetitionType {
    id: number,
    name: string,
};

export type CompetitionItemViewType = {
    id: number,
    name: string,
};

export interface CompetitionType {
    id: number,
    name: string,
    isTomorrow: boolean,
}

const clearEventsInCompetition = (data: EventListGroupCompetitionItemType): EventListGroupCompetitionItemType => {
    return {
        id: data.id,
        name: data.name,
        displayOrder: data.displayOrder,
        events: []
    };
};

const mapCompetition = (
    data: EventListGroupCompetitionItemType,
    filter: (event: EventListGroupEventItemType) => boolean
): EventListGroupCompetitionItemType => {
    return {
        id: data.id,
        name: data.name,
        displayOrder: data.displayOrder,
        events: data.events.filter(filter)
    };
};

const mapSport = (
    data: EventListGroupSportItemType,
    map: (competition: EventListGroupCompetitionItemType) => EventListGroupCompetitionItemType
): EventListGroupSportItemType => {
    const competitions = [];
    
    for (const item of data.competitions) {
        const newCompetition = map(item);
        if (newCompetition.events.length > 0) {
            competitions.push(newCompetition);
        }
    }

    return {
        id: data.id,
        name: data.name,
        displayOrder: data.displayOrder,
        competitions
    };
};

const mapGroup = (
    data: EventListGroupType,
    map: (sport: EventListGroupSportItemType) => EventListGroupSportItemType,
): EventListGroupType => {
    const sports = [];

    for (const item of data.sports) {
        const newSport = map(item);
        if (newSport.competitions.length > 0) {
            sports.push(newSport);
        }
    }

    return {
        sports 
    };
};

const filterGroupByEvent = (
    data: EventListGroupType,
    filter: (event: EventListGroupEventItemType) => boolean
): EventListGroupType => {
    return mapGroup(data, (sport) => {
        return mapSport(sport, (competition) => {
            return mapCompetition(competition, filter);
        });
    });
};

const filterByAllParams = (
    data: EventListGroupType,
    filter: (sport: EventListGroupSportItemType, competition: EventListGroupCompetitionItemType, event: EventListGroupEventItemType) => boolean
): EventListGroupType => {
    return mapGroup(data, (sport) => {
        return mapSport(sport, (competition) => {
            return mapCompetition(competition, (event): boolean => {
                return filter(sport, competition, event);
            });
        });
    });
};

const filterGroupByCompetition = (
    data: EventListGroupType,
    filter: (competitionId: number) => boolean
): EventListGroupType => {
    return mapGroup(data, (sport) => {
        return mapSport(sport, (competition) => {
            const pass = filter(competition.id);
            return pass ? competition : clearEventsInCompetition(competition);
        });
    });
};

const filterGroupBySport = (
    data: EventListGroupType,
    filter: (sportId: string) => boolean
): EventListGroupType => {
    return {
        sports: data.sports.filter(sport => filter(sport.id))
    };
};

export class EventsCollectionQueryModel {
    private readonly serverTime: ServerTimeState;
    private readonly model: MobxValue<EventListGroupType> | (() => EventListGroupType);

    public constructor(
        serverTime: ServerTimeState,
        model: MobxValue<EventListGroupType> | (() => EventListGroupType)
    ) {
        this.serverTime = serverTime;
        this.model = model;
    }

    @computed public get value(): EventListGroupType {
        const model = this.model;

        if (typeof model === 'function') {
            return model();
        }

        return model.getValue();
    }

    @computed public get isEmpty(): boolean {
        const value = this.value;
        return value.sports.length === 0;
    }

    @computed.struct public get competitions(): Array<EventsCollectionQueryCompetitionType> {

        const list: Array<EventsCollectionQueryCompetitionType> = [];

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                list.push({
                    id: competition.id,
                    name: competition.name
                });
            }
        }

        return list;
    }

    @computed.struct public get competitionsSortById(): Array<EventsCollectionQueryCompetitionType> {
        const list: Array<EventsCollectionQueryCompetitionType> = this.competitions.concat([]);

        list.sort((a,b) => a.id - b.id);

        return list;
    }

    public static createEmpty(serverTime: ServerTimeState): EventsCollectionQueryModel {
        const list: EventListGroupType = {
            sports: []
        };

        return new EventsCollectionQueryModel(serverTime, MobxValue.create({
            initValue: list
        }));
    }

    @computed.struct public get events(): Array<EventListGroupEventItemType> {
        const events: Array<Array<EventListGroupEventItemType>> = [];

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                events.push(competition.events);
            }
        }

        const out: Array<EventListGroupEventItemType> = [];
        return out.concat(...events);
    }

    @computed.struct public get ids(): Array<number> {
        return this.events.map((item) => item.id);
    }

    @computed public get length(): number {
        return this.ids.length;
    }

    public limit(limit: number): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.serverTime, (): EventListGroupType => {
            let counter = 0;

            return filterGroupByEvent(this.value, (): boolean => {
                if (counter > limit) {
                    return false;
                }

                counter++;
                return true;
            });
        });
    }

    public filter(filter: (event: EventListGroupEventItemType) => boolean): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.serverTime, (): EventListGroupType => {
            return filterGroupByEvent(this.value, filter);
        });
    }

    public filterBySportAndEvent(filter: (sport: string, event: EventListGroupEventItemType) => boolean): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.serverTime, (): EventListGroupType => {
            return filterByAllParams(
                this.value,
                (sport, _competition, event): boolean => {
                    return filter(sport.id, event);
                }
            );
        });
    }

    public filterByCompetition(filter: (competitionId: number) => boolean): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.serverTime, (): EventListGroupType => {
            return filterGroupByCompetition(this.value, filter);
        });
    }

    public filterBySport(filter: (sportId: string) => boolean): EventsCollectionQueryModel {
        return new EventsCollectionQueryModel(this.serverTime, (): EventListGroupType => {
            return filterGroupBySport(this.value, filter);
        });
    }

    public filterByCompetitionWhenIn(competition: Array<number>): EventsCollectionQueryModel {
        return this.filterByCompetition(competitionId => competition.includes(competitionId));
    }

    @computed.struct public get sportsIds(): Array<string> {
        const ids: Array<string> = [];

        for (const sport of this.value.sports) {
            ids.push(sport.id);
        }

        return ids;
    }

    @computed.struct public get regionIds(): Array<string> {
        const ids: Set<string> = new Set();

        for (const event of this.events) {
            const region = event.tagsRegion;

            if (region !== null) {
                ids.add(region);
            }
        }

        return Array.from(ids);
    }

    @computed.struct public get countryIds(): Array<string> {
        const ids: Set<string> = new Set();

        for (const event of this.events) {
            const country = event.tagsCountry;

            if (country !== null) {
                ids.add(country);
            }
        }

        return Array.from(ids);
    }

    @computed.struct public get competitionIds(): Array<number> {
        const ids: Set<number> = new Set();

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                ids.add(competition.id);
            }
        }

        return Array.from(ids);
    }

    @computed.struct public get competitionIdsByDisplayOrder(): Array<number> {
        const arrayModels: Array<{id: number, displayOrder: number}> = [];

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                arrayModels.push({
                    id: competition.id,
                    displayOrder: competition.displayOrder
                });
            }
        }

        arrayModels.sort((a,b) => b.displayOrder - a.displayOrder);

        const competitionsIds = arrayModels.map(item => item.id);

        const competitionsIdsDedup: Array<number> = Array.from(new Set(competitionsIds));

        return competitionsIdsDedup;
    }

    @computed.struct public get competitionForViewByDisplayOrder(): Array<CompetitionItemViewType> {
        const arrayModels: Array<{id: number, displayOrder: number, name: string}> = [];

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                arrayModels.push({
                    id: competition.id,
                    displayOrder: competition.displayOrder,
                    name: competition.name,
                });
            }
        }

        arrayModels.sort((a,b) => b.displayOrder - a.displayOrder);

        return arrayModels;
    }

    @computed public get competitionForView(): Array<CompetitionItemViewType> {
        const result: Array<CompetitionItemViewType> = [];

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                result.push({
                    id: competition.id,
                    name: competition.name
                });
            }
        }

        return result;
    }

    @computed public get competitionForViewSortByName(): Array<CompetitionItemViewType> {
        const list = this.competitionForView.concat([]);

        list.sort((a: CompetitionItemViewType, b: CompetitionItemViewType) => {
            return a.name.localeCompare(b.name);
        });

        return list;
    }

    @computed.struct public get competitionIdsByDisplayOrderAndDay(): Array<CompetitionType> {
        const competitonsToday: Map<number, string> = new Map();
        const competitonsTomorrow: Map<number, string> = new Map();

        for (const sport of this.value.sports) {
            for (const competition of sport.competitions) {
                for (const event of competition.events) {
                    if (this.serverTime.tomorrow.matchMs(event.startTime)) {
                        competitonsTomorrow.set(competition.id, competition.name);
                    } else {
                        competitonsToday.set(competition.id, competition.name);
                    }
                }
            }
        }

        const out: Array<CompetitionType> = [];

        for (const [competitionId, name] of competitonsToday.entries()) {
            out.push({
                id: competitionId,
                name,
                isTomorrow: false,
            });
        }

        for (const [competitionId, name] of competitonsTomorrow.entries()) {
            out.push({
                id: competitionId,
                name,
                isTomorrow: true,
            });
        }
        
        return out;
    }
}
