import { ConfigTypes } from 'src/config/features/types';
export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export const nebetConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'support@ne-bet.com',
    accountNavigationHelpText: true,
    accountNavSignUpIcon: 'nebet-brand-icon',
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
    betSlipLocalStorage: false,
    betslipHeaderWithCloseAll: true,
    betslipReceiptClose: true,
    bettingTabCarousel: false,
    bogCard: true,
    buildRacecardCheckboxColorMode: 'light',

    /* C */
    callDelayPromise: true,
    cashoutIconDisplay: false,
    casinoFiltersSkin: FiltersSkin.PRIMARY,
    casinoGameImg: 'nebet',
    casinoPopUp: false,
    casinoLaunchGameModalLogo: 'NeBetLogo',
    circleArrow: false,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: '0800 160 1996',
        email: null,
        facebookLink: null,
        twitterLink: null,
        instagramLink: null,
    },
    contactUsList: 'nebet',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsNebet',

    /* D */
    dateRangeButton: false,
    depositLimitsText: false,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'support@ne-bet.com',
    eventsEuropeanEliteMcbookie: false,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: false,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: false,

    /* F */
    footerCopyrightType: 'nebet',
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
    googleAnalyticsOptimizeID: '',
    googleAnalyticsTagManager: 'UA-144385523-1',
    googleExperimentIdDev: '',
    googleExperimentIdProd: '',

    /* H */

    hasAlternativeBalancesVisible: true,
    hasCashoutEnabled: true,
    hasCasinoEnabled: true,
    hasFaqSection: true,
    hasFreeBetCreditsEnabled: true,
    hasInPlayDelayInformation: true,
    hasLanguageSwitcherInAccountMenu: false,
    hasMaxBetEnabled: true,
    hasNeedHelpAccountSection: true,
    hasPromoCodeOnRegistrationAvailable: true,
    hasTopUpEnabled: true,
    hasTraderChat: true,
    hasUserAddressChangeEnabled: true,
    hasUserContactNumberChangeEnabled: true,
    hasUserEmailChangeEnabled: true,
    headerLinks: ['sports', 'in-play', 'virtuals-nyx', 'casino', 'live-casino'],
    headerLogo: 'NeBetMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no',
    headerMetaTitleName: 'NE-Bet',
    headerSpecialLink: null,
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
    iosIconLink: true,
    isHeroEventEnabled: false,
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
    landingPageSignupUniverseInfo: 'NE-Bet',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcdg00000004199',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000005025',
        },
    },
    liveCasinoIcon: 'iconNebet',
    liveCasinoTokenIcon: true,
    loginInputLabel: 'default',
    loginInputType: 'email',
    loginOnResetPasswordSuccess: false,
    lottery: false,

    /* M */
    manifestLink: true,
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
    pageNotFoundError: 'Nebet404ErrorLogo',
    page404Default: true,
    payoutRules: false,
    playBreakConfirmWithTitle: false,
    playWithStarSportsInfoBlock: false,
    prefixesSortedByCountries: true,
    priceHistoryLineChart: true,

    /* R */
    rab: false,
    rabCashoutAvailable: false,
    rabHeaderIcon: 'BetBuilderIcon',
    rabHeaderTitle: 'Bet Builder',
    racingPageTabNames: 'default',
    realityCheckConfirmWithTitle: false,
    recentlyVisitedLocalStorage: true,
    recentlyVisitedScrollToTop: false,
    redirectToLadingPage: false,
    resetPasswordForm: 'ResetPasswordForm',
    responsibleGamblingCompanyName: 'NE-Bet',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'nebet',
    scoreboardFiveSports: true,
    scoreboardType: 'nebet',
    selectionCarousel: false,
    selectionCastCarousel: false,
    selectionNewVersionCarousel: false,
    selectionViewPriceFixed: false,
    selfExclusionConfirmWithTitle: false,
    setAffiliateInPlaceBet: false,
    shouldDisplaySilkWithoutQuestionMark: false,
    showDefaultSportPageHeaderImage: false,
    showGolfOnVirtuals: true,
    showGreyhoundracingPageHeaderImage: false,
    showHiddenSports: false,
    showHorseracingPageHeaderImage: false,
    showKycStatus: false,
    showRightSidebarOnErrorPage: false,
    showSpecialEventsHeaderLinks: false,
    signupDocumentProcedureOn: true,
    signUpFacebookAppId: '742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'support@ne-bet.com',
    signupLink: true,
    signUpShowPromoCode: true,
    simpleFooter: false,
    siteVerificationMetaMap: null,
    sliceNameRaceLabel: true,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: false,
    starEventsLabel: 'Main Events',
    starSportsInfoBlock: false,
    styleMainSrc: 'nebetStyle',

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
    unSupportedBrowsersLogo: 'NebetLogoWrapper',
    updateQuickBet: true,
    usePaymentFormForUniverse: 'secureTrading',

    /* Z */
    zendeskKey: 'ce9c9065-d346-4312-8a98-bd50f5ea8319',
};
