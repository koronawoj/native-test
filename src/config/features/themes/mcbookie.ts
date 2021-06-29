import { ConfigTypes } from 'src/config/features/types';
export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

export const mcbookieConfig: ConfigTypes = {
    /* A */
    accountHelperMail: 'support@mcbookie.com',
    accountNavigationHelpText: false,
    accountNavSignUpIcon: 'mcbookie-brand-icon',
    addGameToHistoryProviderGameId: false,
    affiliateChangeInSignup: false,
    affiliates: false,
    apiEventListIncludes: {
        horseracing: ['internationalhorseracing', 'horseracingantepost'],
        greyhoundracing: ['internationalgreyhoundracing'],
    },
    autoLogoutUser: false,
    accountIdPrefix: 'MCB',

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
    casinoGameImg: 'mcbookie',
    casinoPopUp: false,
    casinoLaunchGameModalLogo: 'McBookieLogo',
    circleArrow: true,
    consoleWarnBetslipTranslation: false,
    consoleWarnTranslateFormErrors: false,
    consoleWarnTranslateSport: false,
    contactDetails: {
        phoneNumber: null,
        email: 'support@mcbookie.com',
        facebookLink: null,
        twitterLink: 'https://twitter.com/McBookie',
        instagramLink: null,
    },
    contactUsList: 'mcbookie',
    cookiesPolicyBox: true,
    currencyEuroDefault: false,
    couponForEnv: 'couponsMcBookie',

    /* D */
    dateRangeButton: false,
    depositLimitsText: true,
    displayTranslatedSelectionName: false,

    /* E */
    emailKycWarning: 'support@mcbookie.com',
    eventsEuropeanEliteMcbookie: true,
    eventsMarketsCarousel: false,
    eventsOnLaterHomePage: false,
    eventsTableFilterGroup: true,
    eventsTablePriceLegend: true,
    eventStreaming: false,

    /* F */
    footerCopyrightType: 'mcbookie',
    forgotPasswordInputLabel: 'mcbookie',
    forgotPasswordInputType: 'text',
    formInputDisabledClass: true,
    formInputFontLarger: true,
    formNewInputAddClassError: false,
    freeBetTax: false,

    /* G */
    gamStopConfirmationBox: true,
    getGameCasinoChangeHref: false,
    googleAnalyticsID: 'GTM-KQ4XV4',
    googleAnalyticsOptimizeID: '',
    googleAnalyticsTagManager: '',
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
    hasPromoCodeOnRegistrationAvailable: false,
    hasTopUpEnabled: true,
    hasTraderChat: true,
    hasUserAddressChangeEnabled: true,
    hasUserContactNumberChangeEnabled: true,
    hasUserEmailChangeEnabled: true,
    headerLinks: ['sports', 'in-play', 'virtuals-leap', 'casino', 'live-casino', 'mcbookie-blog'],
    headerLogo: 'McbookieMainLogo',
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no',
    headerMetaTitleName: 'McBookie',
    headerSpecialLink: 'mcbookieblog',
    headerType: 'HeaderMainMcBookie',
    heroPageSimpleTemplate: false,
    hideAllCasinoGamesOnChristmas: false,
    hiddenSportsList: [
        'tennisdoubles'
    ],
    homePageDefaultOrder: 'mcbookie',

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
    isZenDeskAlwaysEnabled: true,
    isZenDeskAuthorizedCasinoEnabled: false,
    isZenDeskAuthorizedWhenSignupVisible: true,

    /* K */
    keyboardHideButton: false,

    /* L */
    landingPageSignupUniverseInfo: 'McBookie',
    liveCasino: {
        prod: {
            host: 'dga.pragmaticplaylive.net',
            casinoId: 'ppcdg00000004197',
        },
        dev: {
            host: 'prelive-dga.pragmaticplaylive.net',
            casinoId: 'ppcdk00000005025',
        },
    },
    liveCasinoIcon: 'iconDefault',
    liveCasinoTokenIcon: false,
    loginInputLabel: 'mcbookie',
    loginInputType: 'text',
    loginOnResetPasswordSuccess: true,
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
    openBets: false,
    oddsFormatDefault: false,

    /* P */
    pageNotFoundError: 'McBookie404ErrorLogo',
    page404Default: true,
    payoutRules: true,
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
    resetPasswordForm: 'McBookieValidateAccountForm',
    responsibleGamblingCompanyName: 'McBookie',

    /* S */
    scoreboardAllSports: false,
    scoreboardAmericanSportBg: 'mcbookie',
    scoreboardFiveSports: true,
    scoreboardType:  'mcbookie',
    selectionCarousel: false,
    selectionCastCarousel: false,
    selectionNewVersionCarousel: false,
    selectionViewPriceFixed: false,
    selfExclusionConfirmWithTitle: false,
    setAffiliateInPlaceBet: false,
    shouldDisplaySilkWithoutQuestionMark: false,
    showDefaultSportPageHeaderImage: false,
    showGolfOnVirtuals: false,
    showGreyhoundracingPageHeaderImage: false,
    showHiddenSports: false,
    showHorseracingPageHeaderImage: false,
    showKycStatus: false,
    showRightSidebarOnErrorPage: false,
    showSpecialEventsHeaderLinks: false,
    signupDocumentProcedureOn: true,
    signUpFacebookAppId: '742454712985773', // --> Two-Up Facebook Account
    signupFacebookProcedureOn: false,
    signUpFooterMail: 'support@mcbookie.com',
    signupLink: true,
    signUpShowPromoCode: false,
    simpleFooter: false,
    siteVerificationMetaMap: null,
    sliceNameRaceLabel: false,
    sliceUrlInContentPages: false,
    sportsPageCarousel: false,
    starEvents: false,
    starEventsLabel: 'Tartan Top-Ups',
    starSportsInfoBlock: false,
    styleMainSrc: 'mcbookieStyle',

    /* T */
    timeoutToTestSignupFlow: false,
    topUpProcedureBtnDisabled: false,
    topUpTitle: true,
    traderChatLabel: 'mcbookie',
    trapChallenge: false,
    tzStartTimeMeetingsEvent: true,
    tzStartTimeQuickPickColumn: true,
    tzStartTimeRaceLabel: true,
    tzTimeFormatRaceBox: true,

    /* U */
    unSupportedBrowsers: false,
    unSupportedBrowsersLogo: 'McBookieLogoWrapper',
    updateQuickBet: false,
    usePaymentFormForUniverse: 'secureTrading',

    /* Z */
    zendeskKey: '239e6f61-7f3c-4491-b282-48ec55c6200f',
};
