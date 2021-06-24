import { countries, CountryCodesTypes } from './countries';
import mobilePrefixes from './prefixes';
import { UniverseType } from './features/config';
import * as t from 'io-ts';

export const CurrencyCodeIO = t.union([
    t.literal('GBP'),
    t.literal('EUR'),
    t.literal('XTS'),
    t.literal('CAD'),
    t.literal('NZD'),
    t.literal('USD')
]);

export type CurrencyType = t.TypeOf<typeof CurrencyCodeIO>;

export const RESOLUTIONS = {
    MOBILE: {
        MAX: 1024
    },
    DESKTOP: {
        MIN: 1440
    },
};

type CurrencySymbolType = '£' | '€' | 'X' | '$';

const currencies: Record<UniverseType, CurrencyType[]> = {
    'nebet': ['GBP', 'EUR'],
    'mcbookie': ['GBP', 'EUR'],
    'star': ['GBP', 'EUR'],
    'carousel': ['EUR', 'CAD', 'NZD'],
    'sbbet': ['EUR', 'CAD', 'NZD'],
    'orbitalbet': ['GBP', 'EUR'],
    'bongos': ['GBP', 'EUR'],
    'vickers': ['GBP', 'EUR'],
    'rhino': ['GBP', 'EUR'],
    'betzone': ['GBP', 'EUR'],
    'planetsportbet': ['GBP', 'EUR'],
};

const defaultCountry: Record<UniverseType, CountryCodesTypes> = {
    'nebet': 'GB',
    'mcbookie': 'GB',
    'star': 'GB',
    'carousel': 'DE',
    'sbbet': 'DE',
    'orbitalbet': 'GB',
    'bongos': 'GB',
    'vickers': 'GB',
    'rhino': 'GB',
    'betzone': 'GB',
    'planetsportbet': 'GB',
};

const symbols: Record<CurrencyType, CurrencySymbolType> = {
    GBP: '£',
    EUR: '€',
    XTS: 'X',
    CAD: '$',
    NZD: '$',
    USD: '$'
};

const configs = {
    devTools: true,
    IA_DOMAIN_URL: 'https://wlcarouselgroup.adsrv.eacdn.com',
    currencies,
    symbols,
    defaultCountry,
    minDeposit: 1000,
    minWithdraw: 100,
    contactChannels: [
        { type: 'email', name: 'Email' },
        { type: 'sms', name: 'SMS' },
        { type: 'phone', name: 'Phone' }
    ],
    countries,
    mobilePrefixes
};

export const getCookie = (name: string): string | null => {
    for (const cookie of document.cookie.split(';')) {
        const cookieChunk = cookie.trim().split('=');

        const cookieName = cookieChunk[0];
        const cookieValue = cookieChunk[1];

        if (cookieName === undefined || cookieValue === undefined) {
            console.warn(`getCookie: Broken cookie part => ${cookie}`);
            continue;
        }

        if (cookieChunk.length !== 2) {
            console.warn(`getCookie: Incorrect number of cookieChunk => ${cookieChunk.length} in ${cookie}`);
            continue;
        }

        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null;
};

export const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    let expires = '';

    if (days) {
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }

    document.cookie = `${name}=${value || ''}${expires}; path=/`;
};


export const insertIncomeAccessPixel = ( accountId: number ): void => {
    const IA_DOMAIN_URL = configs.IA_DOMAIN_URL;

    // Embed pixel only if the user has registered with IA
    if ( IA_DOMAIN_URL && accountId ) {
        const src = `${IA_DOMAIN_URL}/Processing/Pixels/Registration.ashx?PlayerID=${accountId}&mid=3`;

        const oldIframe = document.getElementById( 'ia-pixel' );
        let newIframe = null;

        if ( !oldIframe ) {
            newIframe = document.createElement( 'iframe' );
        }

        const iframe = oldIframe || newIframe;

        if (iframe === null) {
            console.error('config.ts iframe is null');
        } else {
            iframe.setAttribute( 'display', 'none' );
            iframe.setAttribute( 'id', 'ia-pixel' );
            iframe.setAttribute( 'src', src );
        }

        if ( newIframe ) {
            document.body.appendChild( newIframe );
        }
    }
};

export default configs;
