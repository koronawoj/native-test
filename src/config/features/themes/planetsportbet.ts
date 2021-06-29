import { ConfigTypes } from 'src/config/features/types';
export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export const planetsportConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'customerservice@planetsportbet.com',
    accountNavigationHelpText: false,
    accountNavSignUpIcon: 'planetsport-brand-icon',
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
    casinoLaunchGameModalLogo: 'PlanetSportLogo',
    circleArrow: false,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: null,
        email: 'customerservice@planetsportbet.com',
        facebookLink: 'https://www.facebook.com/planetsportbet',
        twitterLink: 'https://twitter.com/planetsportbet',
        instagramLink: 'https://www.instagram.com/planetsportbet/',
    },
    contactUsList: 'planetsportbet',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsStar',

    /* D */
    dateRangeButton: false,
    depositLimitsText: false,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'customerservice@planetsportbet.com',
    eventsEuropeanEliteMcbookie: false,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: true,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: false,

    /* F */
    footerCopyrightType: 'planetsportbet',
    forgotPasswordInputLabel: 'default',
    forgotPasswordInputType: 'email',
    formInputDisabledClass: false,
    formInputFontLarger: false,
    formNewInputAddClassError: false,
    freeBetTax: false,

    /* G */
    gamStopConfirmationBox: true,
    getGameCasinoChangeHref: false,
    googleAnalyticsID: 'GTM-58M7NS7',
    googleAnalyticsOptimizeID: 'OPT-5WB7555',
    googleAnalyticsTagManager: '',
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
    headerLinks: ['sports', 'in-play', 'casino', 'live-casino'],
    headerLogo: 'PlanetSportMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
    headerMetaTitleName: 'Planet Sport Bet - Your world of sports betting',
    headerSpecialLink: null,
    headerType: 'HeaderMainStar',
    heroPageSimpleTemplate: false,
    hideAllCasinoGamesOnChristmas: false,
    hiddenSportsList: [
        'tennisdoubles'
    ],
    homePageDefaultOrder: 'planetsportbet',

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
    isZenDeskAuthorizedCasinoEnabled: false,
    isZenDeskAuthorizedWhenSignupVisible: false,

    /* K */
    keyboardHideButton: false,

    /* L */
    landingPageSignupUniverseInfo: 'Planet Sport Bet',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcds00000005387',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000006768',
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
    navigationPopular: false,
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
    pageNotFoundError: 'PlanetSport404ErrorLogo',
    page404Default: false,
    payoutRules: false,
    playBreakConfirmWithTitle: false,
    playWithStarSportsInfoBlock: false,
    prefixesSortedByCountries: true,
    priceHistoryLineChart: true,

    /* R */
    rab: true,
    rabCashoutAvailable: false,
    rabHeaderIcon: 'BetBuilderIcon',
    rabHeaderTitle: 'Build-a-Bet',
    racingPageTabNames: 'default',
    realityCheckConfirmWithTitle: false,
    recentlyVisitedLocalStorage: true,
    recentlyVisitedScrollToTop: false,
    redirectToLadingPage: false,
    resetPasswordForm: 'ResetPasswordForm',
    responsibleGamblingCompanyName: 'Planet Sport Bet',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'planetsportbet',
    scoreboardFiveSports: true,
    scoreboardType: 'planetsportbet',
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
    signUpFacebookAppId: '', //'742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'customerservice@planetsportbet.com',
    signupLink: true,
    signUpShowPromoCode: true,
    simpleFooter: false,
    siteVerificationMetaMap: null,
    sliceNameRaceLabel: true,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: false,
    starEventsLabel: 'Featured Events',
    starSportsInfoBlock: false,
    styleMainSrc: 'planetSportStyle',

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
    usePaymentFormForUniverse: 'secureTrading',

    /* Z */
    zendeskKey: '',
};
