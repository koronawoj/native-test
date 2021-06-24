import { UniverseType } from './features/config';

export const hasCasinoEnabled = (_universe: UniverseType): boolean => true;

export const hasTopUpEnabled = (_universe: UniverseType): boolean => true;




//This is the configuration for API_UNIVERSE.
export const mutltiLanguageForUniverse = (universe: UniverseType): boolean => {
    if (universe === 'carousel') {
        return true;
    }

    return false;
};

export const getStarEventsNameForSearch = (_universe: UniverseType): string => {
    return 'star-events';
};
