import { ConfigTypes } from 'src/config/features/types';
export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export const rhinoConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'customerservice@rhino.bet',
    accountNavigationHelpText: false,
    accountNavSignUpIcon: 'rhino-brand-icon',
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
    buildRacecardCheckboxColorMode: 'dark',

    /* C */
    callDelayPromise: true,
    cashoutIconDisplay: false,
    casinoFiltersSkin: FiltersSkin.PRIMARY,
    casinoGameImg: 'star',
    casinoPopUp: false,
    casinoLaunchGameModalLogo: 'RhinoLogo',
    circleArrow: false,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: null,
        email: null,
        facebookLink: 'https://www.facebook.com/betrhino',
        twitterLink: 'https://twitter.com/@BetRhino',
        instagramLink: null,
    },
    contactUsList: 'rhino',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsStar',

    /* D */
    dateRangeButton: false,
    depositLimitsText: false,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'customerservice@rhino.bet',
    eventsEuropeanEliteMcbookie: false,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: true,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: false,

    /* F */
    footerCopyrightType: 'rhino',
    forgotPasswordInputLabel: 'default',
    forgotPasswordInputType: 'email',
    formInputDisabledClass: false,
    formInputFontLarger: false,
    formNewInputAddClassError: false,
    freeBetTax: false,

    /* G */
    gamStopConfirmationBox: true,
    getGameCasinoChangeHref: false,
    googleAnalyticsID: 'GTM-58R8TTF',
    googleAnalyticsOptimizeID: 'OPT-WRZPJWL',
    googleAnalyticsTagManager: 'G-NP97Y73FPB',
    googleExperimentIdDev: '',
    googleExperimentIdProd: '',

    /* H */
    hasAlternativeBalancesVisible: true,
    hasCashoutEnabled: true,
    hasCasinoEnabled: true,
    hasFaqSection: false,
    hasFreeBetCreditsEnabled: true,
    hasInPlayDelayInformation: true,
    hasLanguageSwitcherInAccountMenu: false,
    hasMaxBetEnabled: false,
    hasNeedHelpAccountSection: true,
    hasPromoCodeOnRegistrationAvailable: true,
    hasTopUpEnabled: true,
    hasTraderChat: false,
    hasUserAddressChangeEnabled: true,
    hasUserContactNumberChangeEnabled: true,
    hasUserEmailChangeEnabled: true,
    headerLinks: ['sports', 'in-play', 'casino', 'live-casino', 'rhino-promotions'],
    headerLogo: 'RhinoMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
    headerMetaTitleName: 'Rhino',
    headerSpecialLink: null,
    headerType: 'HeaderMainStar',
    heroPageSimpleTemplate: false,
    hideAllCasinoGamesOnChristmas: false,
    hiddenSportsList: [
        'tennisdoubles',
        'australianrules',
        'badminton',
        'cycling',
        'esports',
        'gaelicfootball',
        'gaelichurling',
        'handball',
        'tabletennis',
        'volleyball'
    ],
    homePageDefaultOrder: 'rhino',

    /* I */
    inputVisitedBackgroundChange: true,
    insertIncomeAccessPixel: false,
    iosIconLink: false,
    isHeroEventEnabled: true,
    isPromoSidebarAvailable: true,
    isSentryEnabled: true,
    isSignUpAvailable: true,
    isStreamControlledByTime: false,
    isStreamVisibleForUnauthorized: true,
    isVerifyAccountWithSMSAvailable: false,
    isZenDeskAlwaysEnabled: false,
    isZenDeskAuthorizedCasinoEnabled: false,
    isZenDeskAuthorizedWhenSignupVisible: false,

    /* K */
    keyboardHideButton: false,

    /* L */
    landingPageSignupUniverseInfo: 'Rhino',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000005223',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000006368',
        },
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
    navigationPopular: false,
    navigationFavourites: false,
    navigationRecentlyViewed: true,
    navigationMobileLinks: 'special-links',
    newSignup: true,
    notAttemptedDeposit: false,
    notificationsList: true,

    /* O */
    oddsFormatDefault: false,
    openBets: false,

    /* P */
    pageNotFoundError: 'Rhino404ErrorLogo',
    page404Default: true,
    payoutRules: false,
    playBreakConfirmWithTitle: false,
    playWithStarSportsInfoBlock: false,
    prefixesSortedByCountries: true,
    priceHistoryLineChart: false,

    /* R */
    rab: true,
    rabCashoutAvailable: true,
    rabHeaderIcon: 'BetBuilderIcon',
    rabHeaderTitle: 'Bet Builder',
    racingPageTabNames: 'default',
    realityCheckConfirmWithTitle: false,
    recentlyVisitedLocalStorage: true,
    recentlyVisitedScrollToTop: false,
    redirectToLadingPage: false,
    resetPasswordForm: 'ResetPasswordForm',
    responsibleGamblingCompanyName: 'Rhino',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'rhino',
    scoreboardFiveSports: true,
    scoreboardType: 'rhino',
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
    showSpecialEventsHeaderLinks: false,
    signupDocumentProcedureOn: true,
    signUpFacebookAppId: '742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'customerservice@rhino.bet',
    signupLink: true,
    signUpShowPromoCode: true,
    simpleFooter: false,
    siteVerificationMetaMap: null,
    sliceNameRaceLabel: true,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: false,
    starEventsLabel: 'Rhino Events',
    starSportsInfoBlock: false,
    styleMainSrc: 'rhinoStyle',

    /* T */
    timeoutToTestSignupFlow: false,
    topUpProcedureBtnDisabled: false,
    topUpTitle: false,
    traderChatLabel: 'default',
    trapChallenge: false,
    tzStartTimeMeetingsEvent: true,
    tzStartTimeQuickPickColumn: true,
    tzStartTimeRaceLabel: true,
    tzTimeFormatRaceBox: true,

    /* U */
    unSupportedBrowsers: true,
    unSupportedBrowsersLogo: 'StarsportsLogoIconWrapper',
    updateQuickBet: false,
    usePaymentFormForUniverse: 'secureTrading',

    /* Z */
    zendeskKey: 'ce9c9065-d346-4312-8a98-bd50f5ea8319',
};
