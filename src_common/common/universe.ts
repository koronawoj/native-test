import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

/* STAR UNIVERSE TYPE */

export const UniverseStarIO = t.union([
    //star template
    t.literal('star'),
    t.literal('mcbookie'),
    t.literal('nebet'),
    t.literal('vickers'),
    t.literal('rhino'),
    t.literal('betzone'),
    t.literal('planetsportbet'),
]);

export const decodeUniverseStar = buildValidator('UniverseStarParamIO', UniverseStarIO, true);

export type UniverseStarType = t.TypeOf<typeof UniverseStarIO>;

export const getAllUniverseStarStr = (): Array<string> => {
    return [
        'star',
        'mcbookie',
        'nebet',
        'vickers',
        'rhino',
        'betzone',
        'planetsportbet',
    ];
};

/* UNIVERSE TYPE */
export const UniverseIO = t.union([
    //star template
    t.literal('star'),
    t.literal('mcbookie'),
    t.literal('nebet'),
    t.literal('vickers'),
    t.literal('rhino'),
    t.literal('betzone'),
    t.literal('planetsportbet'),

    //carousel template
    t.literal('carousel'),
    t.literal('sbbet'),

    //orbitalbet template
    t.literal('orbitalbet'),

    //bongos template
    t.literal('bongos'),
]);

export const decodeUniverse = buildValidator('UniverseParamIO', UniverseIO, true);

export type UniverseType = t.TypeOf<typeof UniverseIO>;

export const getAllUniverseStr = (): Array<string> => {
    return [
        'star',
        'mcbookie',
        'nebet',
        'vickers',
        'rhino',
        'betzone',
        'planetsportbet',

        'carousel',
        'sbbet',

        'orbitalbet',

        'bongos'
    ];
};
