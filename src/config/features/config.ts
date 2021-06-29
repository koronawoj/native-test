import { computed } from 'mobx';

import { starConfig } from './themes/star';
import { mcbookieConfig } from './themes/mcbookie';
import { nebetConfig } from './themes/nebet';
import { vickersConfig } from './themes/vickers';
import { rhinoConfig } from './themes/rhino';
import { betzoneConfig } from './themes/betzone';
import { planetsportConfig } from './themes/planetsportbet';

import { UniverseType } from 'src_common/common/universe';
import { ConfigTypes, HeaderLinksMenuType, HeaderLinksType } from './types';
import { LocalStorageState } from 'src/appState/LocalStorage/LocalStorageState';

const headerLinksMap: Record<HeaderLinksType, HeaderLinksMenuType> = {
    'sports': 'sports',
    'in-play': 'in-play',
    'virtuals-leap': 'virtuals',
    'virtuals-nyx': 'virtuals',
    'casino': 'casino',
    'live-casino': 'live-casino',
    'mcbookie-blog': 'mcbookie-blog',
    'star-news': 'star-news',
    'lottery': 'lottery',
    'rhino-promotions': 'rhino-promotions'
};

const convertHeaderLinks = (value: HeaderLinksType): HeaderLinksMenuType => {
    return headerLinksMap[value];
};

const theme: Record<UniverseType, ConfigTypes> = {
    star: starConfig,
    mcbookie: mcbookieConfig,
    nebet: nebetConfig,
    vickers: vickersConfig,
    rhino: rhinoConfig,
    betzone: betzoneConfig,
    planetsportbet: planetsportConfig,

    carousel: starConfig,
    sbbet: starConfig,
    orbitalbet: starConfig,
    bongos: starConfig,
};

const envConfig = (universe: UniverseType): ConfigTypes => {
    return theme[universe];
};

export type ConfigMainType = ConfigTypes;

export class ConfigComponents  {
    /**
     * @deprecated - create an appropriate configuration, stop using this variable
     */
    public readonly universe: UniverseType;
    private readonly localStorageState?: LocalStorageState;

    public constructor(universe: UniverseType, localStorageState?: LocalStorageState) {
        this.universe = universe;
        this.localStorageState = localStorageState;
    }

    @computed public get config(): ConfigTypes {
        const universe = this.universe;

        if (this.localStorageState !== undefined) {
            return {
                ...envConfig(universe),
                ...this.localStorageState.debugPanelConfig.getValue()
            };
        }

        return {
            ...envConfig(universe)
        };
    }

    @computed public get hasVirtualLeapEnabled(): boolean {
        return this.config.headerLinks.includes('virtuals-leap');
    }

    @computed public get hasVirtualNyxEnabled(): boolean {
        return this.config.headerLinks.includes('virtuals-nyx');
    }

    @computed public get hasVirtualSportsEnabled(): boolean {
        return this.hasVirtualLeapEnabled || this.hasVirtualNyxEnabled;
    }

    @computed public get headerLinksForView(): Array<HeaderLinksMenuType> {
        return this.config.headerLinks.map(convertHeaderLinks);
    }
}
