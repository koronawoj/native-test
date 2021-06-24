import {countries} from './countries';
import prefixes from './prefixes';

export interface OptionItemType {
    id: string,
    prefix: string,
    name: string
};

function prefixesWithCountries(prefixesSortedByCountries: boolean): Array<OptionItemType> {
    const prefixesWithCountries: Array<OptionItemType> = [];

    for (const elem of countries) {
        const prefix = prefixes(prefixesSortedByCountries).find(prefix => prefix.id === elem.id);

        if(prefix) {
            prefixesWithCountries.push({...elem, prefix: prefix.prefix});
        }
    }
    return prefixesWithCountries;
}


export default (prefixesSortedByCountries: boolean):Array<OptionItemType> => prefixesWithCountries(prefixesSortedByCountries);