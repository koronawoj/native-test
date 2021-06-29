import { ConfigTypes } from 'src/config/features/types';
export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export const vickersConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'info@vickers.bet',
    accountNavigationHelpText: false,
    accountNavSignUpIcon: 'vickers-brand-icon',
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
    casinoLaunchGameModalLogo: 'VickersLogo',
    circleArrow: false,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: null,
        email: 'info@vickers.bet',
        facebookLink: null,
        twitterLink: 'https://twitter.com/vickersracing',
        instagramLink: null,
    },
    contactUsList: 'vickers',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsStar',

    /* D */
    dateRangeButton: false,
    depositLimitsText: false,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'compliance@vickers.bet',
    eventsEuropeanEliteMcbookie: false,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: true,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: false,

    /* F */
    footerCopyrightType: 'vickers',
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
    googleAnalyticsTagManager: 'UA-116959261-1',
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
    headerLogo: 'VickersMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no',
    headerMetaTitleName: 'Vickers',
    headerSpecialLink: null,
    headerType: 'HeaderMainStar',
    heroPageSimpleTemplate: false,
    hideAllCasinoGamesOnChristmas: false,
    hiddenSportsList: [
        'tennisdoubles'
    ],
    homePageDefaultOrder: 'vickers',

    /* I */
    inputVisitedBackgroundChange: false,
    insertIncomeAccessPixel: false,
    iosIconLink: false,
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
    landingPageSignupUniverseInfo: 'Vickers',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000004955',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000004734',
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
    pageNotFoundError: 'Vickers404ErrorLogo',
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
    rabHeaderTitle: 'Bet Builder',
    racingPageTabNames: 'default',
    realityCheckConfirmWithTitle: false,
    recentlyVisitedLocalStorage: true,
    recentlyVisitedScrollToTop: false,
    redirectToLadingPage: false,
    resetPasswordForm: 'ResetPasswordForm',
    responsibleGamblingCompanyName: 'Vickers',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'vickers',
    scoreboardFiveSports: true,
    scoreboardType: 'vickers',
    selectionCarousel: false,
    selectionCastCarousel: false,
    selectionNewVersionCarousel: false,
    selectionViewPriceFixed: false,
    selfExclusionConfirmWithTitle: false,
    setAffiliateInPlaceBet: false,
    shouldDisplaySilkWithoutQuestionMark: true,
    showDefaultSportPageHeaderImage: false,
    showGolfOnVirtuals: true,
    showGreyhoundracingPageHeaderImage: false,
    showHiddenSports: true,
    showHorseracingPageHeaderImage: false,
    showKycStatus: true,
    showRightSidebarOnErrorPage: false,
    showSpecialEventsHeaderLinks: false,
    signupDocumentProcedureOn: true,
    signUpFacebookAppId: '742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'info@vickers.bet',
    signupLink: true,
    signUpShowPromoCode: true,
    simpleFooter: false,
    siteVerificationMetaMap: null,
    sliceNameRaceLabel: true,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: false,
    starEventsLabel: 'Vickers Events',
    starSportsInfoBlock: false,
    styleMainSrc: 'vickersStyle',

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
