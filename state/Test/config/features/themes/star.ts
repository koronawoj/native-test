import { ConfigTypes } from '../types';

export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}


export const starConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'cs@starsportsbet.co.uk',
    accountNavigationHelpText: false,
    accountNavSignUpIcon: 'star-brand-icon',
    addGameToHistoryProviderGameId: false,
    affiliateChangeInSignup: false,
    affiliates: false,
    apiEventListIncludes: {
        horseracing: ['internationalhorseracing', 'horseracingantepost'],
        greyhoundracing: ['internationalgreyhoundracing'],
    },
    autoLogoutUser: false,
    accountIdPrefix: '',

    /* B */
    backspaceButton: false,
    betslipCarousel: false,
    betslipCarouselInBettingTab: false,
    betslipHeaderWithCloseAll: true,
    betSlipLocalStorage: false,
    betslipReceiptClose: true,
    bettingTabCarousel: false,
    bogCard: true,
    buildRacecardCheckboxColorMode: 'light',

    /* C */
    callDelayPromise: true,
    cashoutIconDisplay: false,
    casinoFiltersSkin: FiltersSkin.PRIMARY,
    casinoGameImg: 'star',
    casinoPopUp: false,
    casinoLaunchGameModalLogo: 'StarSportsLogo',
    circleArrow: false,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: '08000 521 321',
        email: null,
        facebookLink: null,
        twitterLink: 'https://twitter.com/StarSports_Bet',
        instagramLink: null,
    },
    contactUsList: 'star',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsStar',

    /* D */
    dateRangeButton: false,
    depositLimitsText: false,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'info@starsportsbet.co.uk',
    eventsEuropeanEliteMcbookie: false,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: true,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: true,

    /* F */
    footerCopyrightType: 'star',
    forgotPasswordInputLabel: 'default',
    forgotPasswordInputType: 'email',
    formInputDisabledClass: false,
    formInputFontLarger: false,
    formNewInputAddClassError: false,
    freeBetTax: false,

    /* G */
    gamStopConfirmationBox: true,
    getGameCasinoChangeHref: false,
    googleAnalyticsID: '',
    googleAnalyticsOptimizeID: 'OPT-PJ3JKV6',
    googleAnalyticsTagManager: 'UA-116959261-1',
    googleExperimentIdDev: 'rLqkqHdqSBC_jYxcua79oQ',
    googleExperimentIdProd: 'zvx0ArtmRgWdHCDKGBk12Q',

    /* H */
    hasAlternativeBalancesVisible: true,
    hasCashoutEnabled: true,
    hasCasinoEnabled: true,
    hasFaqSection: true,
    hasFreeBetCreditsEnabled: true,
    hasInPlayDelayInformation: true,
    hasLanguageSwitcherInAccountMenu: false,
    hasMaxBetEnabled: false,
    hasNeedHelpAccountSection: true,
    hasPromoCodeOnRegistrationAvailable: true,
    hasTopUpEnabled: true,
    hasTraderChat: true,
    hasUserAddressChangeEnabled: true,
    hasUserContactNumberChangeEnabled: true,
    hasUserEmailChangeEnabled: true,
    headerLinks: ['sports', 'in-play', 'virtuals-leap', 'casino', 'live-casino', 'star-news'],
    headerLogo: 'StarSportsMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no',
    headerMetaTitleName: 'StarSports',
    headerSpecialLink: 'starsportsbet',
    headerType: 'HeaderMainStar',
    heroPageSimpleTemplate: false,
    hideAllCasinoGamesOnChristmas: false,
    hiddenSportsList: [
        'tennisdoubles'
    ],
    homePageDefaultOrder: 'default',

    /* I */
    inputVisitedBackgroundChange: false,
    insertIncomeAccessPixel: false,
    iosIconLink: false,
    isHeroEventEnabled: true,
    isPromoSidebarAvailable: true,
    isSentryEnabled: true,
    isSignUpAvailable: true,
    isStreamControlledByTime: false,
    isStreamVisibleForUnauthorized: true,
    isVerifyAccountWithSMSAvailable: true,
    isZenDeskAlwaysEnabled: false,
    isZenDeskAuthorizedCasinoEnabled: true,
    isZenDeskAuthorizedWhenSignupVisible: false,

    /* K */
    keyboardHideButton: false,

    /* L */
    landingPageSignupUniverseInfo: 'Star Sports',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcdg00000004198',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000005025',
        }
    },
    liveCasinoIcon: 'iconDefault',
    liveCasinoTokenIcon: false,
    loginInputLabel: 'default',
    loginInputType: 'email',
    loginOnResetPasswordSuccess: false,
    lottery: false,

    /* M */
    manifestLink: false,
    marketTranslate: false,
    messageBoxCarousel: false,
    messageErrorIcon: false,
    messageSuccessIcon: false,

    /* N */
    navigationListSport: false,
    navigationPopular: true,
    navigationFavourites: false,
    navigationRecentlyViewed: true,
    navigationMobileLinks: 'header-links',
    newSignup: true,
    notAttemptedDeposit: false,
    notificationsList: true,

    /* O */
    oddsFormatDefault: false,
    openBets: false,

    /* P */
    pageNotFoundError: 'Star404ErrorLogo',
    page404Default: true,
    payoutRules: false,
    playBreakConfirmWithTitle: false,
    playWithStarSportsInfoBlock: false,
    prefixesSortedByCountries: true,
    priceHistoryLineChart: true,

    /* R */
    rab: true,
    rabCashoutAvailable: true,
    rabHeaderIcon: 'BetBuilderIcon',
    rabHeaderTitle: 'Build-a-Bet',
    racingPageTabNames: 'default',
    realityCheckConfirmWithTitle: false,
    recentlyVisitedLocalStorage: true,
    recentlyVisitedScrollToTop: false,
    redirectToLadingPage: false,
    resetPasswordForm: 'ResetPasswordForm',
    responsibleGamblingCompanyName: 'Star Sports',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'star',
    scoreboardFiveSports: true,
    scoreboardType: 'star',
    selectionCarousel: false,
    selectionCastCarousel: false,
    selectionNewVersionCarousel: false,
    selectionViewPriceFixed: false,
    selfExclusionConfirmWithTitle: false,
    setAffiliateInPlaceBet: false,
    shouldDisplaySilkWithoutQuestionMark: true,
    showDefaultSportPageHeaderImage: false,
    showGolfOnVirtuals: false,
    showGreyhoundracingPageHeaderImage: false,
    showHiddenSports: false,
    showHorseracingPageHeaderImage: false,
    showKycStatus: true,
    showRightSidebarOnErrorPage: false,
    showSpecialEventsHeaderLinks: true,
    signupDocumentProcedureOn: true,
    signUpFacebookAppId: '415079629469353', //'742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'cs@starsports.co.uk',
    signupLink: true,
    signUpShowPromoCode: true,
    simpleFooter: false,
    siteVerificationMetaMap: {
        name: 'google-site-verification',
        content: '3X8yw6e4RqI-2jQhwZitO8mwv6yXA9J-eGazArVYe-8',
    },
    sliceNameRaceLabel: true,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: true,
    starEventsLabel: 'Star Events',
    starSportsInfoBlock: false,
    styleMainSrc: 'starStyle',

    /* T */
    timeoutToTestSignupFlow: false,
    topUpProcedureBtnDisabled: false,
    topUpTitle: false,
    traderChatLabel: 'default',
    trapChallenge: true,
    tzStartTimeMeetingsEvent: true,
    tzStartTimeQuickPickColumn: true,
    tzStartTimeRaceLabel: true,
    tzTimeFormatRaceBox: true,

    /* U */
    unSupportedBrowsers: true,
    unSupportedBrowsersLogo: 'StarsportsLogoIconWrapper',
    updateQuickBet: false,
    usePaymentFormForUniverse: 'realex',

    /* Z */
    zendeskKey: 'ce9c9065-d346-4312-8a98-bd50f5ea8319',
};
