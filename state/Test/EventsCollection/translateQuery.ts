import { ConfigComponents } from '../config/features/config';
import { EventsCollectionQueryType, EventsCollectionQuerySportType, EventsCollectionQuerySportReplaceType } from '../websocket2/modelsApi/EventsCollectionQuery';

const translateSport = (configComponents: ConfigComponents, sport: string): Array<string> => {
    for (const [sportKey, sportsIncludes] of Object.entries(configComponents.config.apiEventListIncludes)) {
        if (sportKey === sport) {
            return [sport].concat(sportsIncludes);
        }
    }

    return [sport];
};

const translageSportList = (configComponents: ConfigComponents, sports: Array<string>): Array<string> => {
    const out: Array<Array<string>> = [];

    for (const sport of sports) {
        const translateSportItem = translateSport(configComponents, sport);
        out.push(translateSportItem);
    }

    const result: Array<string> = [];
    return result.concat(...out);
};

const translageSports = (configComponents: ConfigComponents, sports?: EventsCollectionQuerySportType): EventsCollectionQuerySportType | undefined => {
    if (sports === undefined) {
        return;
    }

    if (Array.isArray(sports)) {
        return translageSportList(configComponents, sports);
    }

    if (typeof sports === 'string') {
        return translateSport(configComponents, sports);
    }

    return {
        ne: translageSportList(configComponents, sports.ne)
    };
};

const getSportReplaceParam = (configComponents: ConfigComponents): EventsCollectionQuerySportReplaceType => {
    const out: EventsCollectionQuerySportReplaceType = [];

    for (const [sportTo, sportsIncludes] of Object.entries(configComponents.config.apiEventListIncludes)) {
        for (const sportFrom of sportsIncludes) {
            out.push({
                from: sportFrom,
                to: sportTo
            });
        }
    }

    return out;
};

export const translateQuery = (configComponents: ConfigComponents, query: EventsCollectionQueryType): EventsCollectionQueryType => {
    return {
        ...query,
        sport: translageSports(configComponents, query.sport),
        sportReplace: getSportReplaceParam(configComponents)
    };
};
