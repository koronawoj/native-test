export enum FiltersSkin {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

import { UniverseType } from './config';

export type HeaderLinksType = 'sports' | 'in-play' | 'virtuals-leap' | 'virtuals-nyx' | 'casino' | 'live-casino' | 'mcbookie-blog' | 'star-news' | 'lottery' | 'rhino-promotions';
export type HeaderLinksMenuType = 'sports' | 'in-play' | 'virtuals' | 'casino' | 'live-casino' | 'mcbookie-blog' | 'star-news' | 'lottery' | 'rhino-promotions';

export interface ConfigTypes {
    /* A */
    /** @description account for help contact */
    accountHelperMail: string;
    /** @description text Help in account navigation, default text is FAQ */
    accountNavigationHelpText: boolean;
    /** @description signup icon */
    accountNavSignUpIcon: 'star-brand-icon' | 'mcbookie-brand-icon' | 'nebet-brand-icon' | 'vickers-brand-icon' | 'rhino-brand-icon' | 'betzone-brand-icon' | 'planetsport-brand-icon';    /** @description put game to history with providerGame, if false u put nyxGameid */
    /** @description put game to history with providerGame, if false u put nyxGameid */
    addGameToHistoryProviderGameId: boolean;
    /** @description change affiliate if props are change in signup procedure */
    affiliateChangeInSignup: boolean;
    /** @description show link to affiliates in footer */
    affiliates: boolean;
    /** @description ... */
    apiEventListIncludes: Record<string, string[]>,
    /** @description auto logout user and show message box with session expire */
    autoLogoutUser: boolean;
    /** @description prefix for accound Id */
    accountIdPrefix: string;

    /* B */
    /** @description  show beckspace button in betting custom keyboard */
    backspaceButton: boolean;
    /** @description switch to new carousel betslip*/
    betslipCarousel: boolean;
    /** @description  switch to new carousel betslip in betting Tab */
    betslipCarouselInBettingTab: boolean;
    /** @description  show betslip header with "remove all" icon and playwithStarSportsInfoBlock */
    betslipHeaderWithCloseAll: boolean;
    /** @description  get bets from localStorage to reduxState */
    betSlipLocalStorage: boolean;
    /** @description  close betslip receipt after 3 sec */
    betslipReceiptClose: boolean;
    /** @description  switch to carousel bettingTab */
    bettingTabCarousel: boolean;
    /** @description  show bogcard from market.bp in quickPickColumn */
    bogCard: boolean;
    /** @description  set checkbox colors for Build Racecard */
    buildRacecardCheckboxColorMode: 'dark' | 'light',

    /* C */
    /** @description set if bets call with delayPrimise in place-bet */
    callDelayPromise: boolean;
    /** @description display cash out icon for events and markets */
    cashoutIconDisplay: boolean;
    /** @description set casino filters buttons skin */
    casinoFiltersSkin: FiltersSkin,
    /** @description image for casino game */
    casinoGameImg: UniverseType,
    /** @description add popup with message in casino */
    casinoPopUp: boolean;
    /** @description logo for casino launch game modal */
    casinoLaunchGameModalLogo: 'StarSportsLogo' | 'McBookieLogo' | 'NeBetLogo' | 'VickersLogo' | 'RhinoLogo' | 'BetZoneLogo' | 'PlanetSportLogo';
    /** @description display account arrow in circle */
    circleArrow: boolean;
    /** @description add console.warn in BetslipTranslation */
    consoleWarnBetslipTranslation: boolean;
    /** @description add console.warn in translateFormError */
    consoleWarnTranslateFormErrors: boolean;
    /** @description add console.warn in translateSports */
    consoleWarnTranslateSport: boolean;
    /** @description contact possibilities for Contact Us section in the main footer */
    contactDetails: {
        phoneNumber: string | null,
        email: string | null,
        facebookLink: string | null,
        twitterLink: string | null,
        instagramLink: string | null,
    };
    /** @description contacts for Contact Us section in main footer */
    contactUsList: UniverseType;
    /** @description show cookiesPolicy box in the bottom of the page */
    cookiesPolicyBox: boolean;
    /** @description set default euro currency*/
    currencyEuroDefault: boolean;
    /** @description coupon for environment*/
    couponForEnv: 'couponsStar' | 'couponsMcBookie' | 'couponsNebet';

    /* D */
    /** @description turn on button wrapper in dateRange */
    dateRangeButton: boolean;
    /** @description Deposit Limits text in Topup limits procedure, default text is Top Up Limits */
    depositLimitsText: boolean;
    /** @description display translated selection name in SelectionGroup */
    displayTranslatedSelectionName: boolean;

    /* E */
    /** @description email to kyc warning */
    emailKycWarning: string;
    /** @description get ids europeanEliteTemplate from template mcbookie */
    eventsEuropeanEliteMcbookie: boolean;
    /** @description switch to carousel events markets */
    eventsMarketsCarousel: boolean;
    /** @description if route is starEvents show only eventsOnlater in mid layout */
    eventsOnLaterHomePage: boolean;
    /** @description show events filter in eventTable */
    eventsTableFilterGroup: boolean;
    /** @description show price legend in events table */
    eventsTablePriceLegend: boolean;
    /** @description show icons and buttons for live event stream */
    eventStreaming: boolean;

    /* F */
    /** @description set type of copyright text in main footer */
    footerCopyrightType: UniverseType;
    /** @description input label type in forgot password form */
    forgotPasswordInputLabel: 'default' | 'mcbookie' | 'carousel';
    /** @description input type in forgot password form */
    forgotPasswordInputType: 'email' | 'text';
    /** @description add disabled class to form input */
    formInputDisabledClass: boolean;
    /** @description change font-size input to 13px, default is 12px */
    formInputFontLarger: boolean;
    /** @description add error class in form new input */
    formNewInputAddClassError: boolean;
    /** @description get free bet tax from betslip */
    freeBetTax: boolean;

    /* G */
    /** @description show gamStop text in confirmation box */
    gamStopConfirmationBox: boolean;
    /** @description change href for game.bodyJson.url in get Game casino */
    getGameCasinoChangeHref: boolean;
    /** @description google id for analytics */
    googleAnalyticsID: string;
    /** @description google optimize id for google tag manager */
    googleAnalyticsOptimizeID: string;
    /** @description google tag to google tag manager */
    googleAnalyticsTagManager: string;
    /** @description google optimize experiment id for dev */
    googleExperimentIdDev: string;
    /** @description google optimize experiment id for production */
    googleExperimentIdProd: string;

    /* H */
    /** @description turn on/off alternative banace on website */
    hasAlternativeBalancesVisible: boolean;
    /** @description turn on/off able to cashout */
    hasCashoutEnabled: boolean;
    /** @description turn on/off casino */
    hasCasinoEnabled: boolean;
    /** @description turn on/off faq section */
    hasFaqSection: boolean;
    /** @description turn on/off free bet credits */
    hasFreeBetCreditsEnabled: boolean;
    /** @description turn on delay information in InPlayComponent */
    hasInPlayDelayInformation: boolean;
    /** @description turn on/off switcher lang in account menu */
    hasLanguageSwitcherInAccountMenu: boolean;
    /** @description turn on/off limit to bet */
    hasMaxBetEnabled: boolean;
    /** @description turn on/off section with help in account */
    hasNeedHelpAccountSection: boolean;
    /** @description turn on/off promo code in registration */
    hasPromoCodeOnRegistrationAvailable: boolean;
    /** @description turn on/off top up in betslip */
    hasTopUpEnabled: boolean;
    /** @description turn on/off trader chat */
    hasTraderChat: boolean;
    /** @description turn on/off able to change address */
    hasUserAddressChangeEnabled: boolean;
    /** @description turn on/off able to change contact number */
    hasUserContactNumberChangeEnabled: boolean;
    /** @description turn on/off able to change email address */
    hasUserEmailChangeEnabled: boolean;
    /** @description header for universe */
    headerLogo: 'StarSportsMainLogo' | 'McbookieMainLogo' | 'NeBetMainLogo' | 'VickersMainLogo'| 'RhinoMainLogo' | 'BetZoneMainLogo' | 'PlanetSportMainLogo';
    /** @description  header links for universes */
    headerLinks: Array<HeaderLinksType>,
    /** @description ... */
    headerMetaScale: 'width=device-width, initial-scale=1, user-scalable=no' | 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no';
    /** @description ... */
    headerMetaTitleName: string,
    /** @description link to the operator's blog / news section */
    headerSpecialLink: 'mcbookieblog' | 'starsportsbet' | null;
    /** @description  */
    headerType: 'HeaderMainStar' | 'HeaderMainMcBookie';
    /** @description display simple template - do not display by columns templates */
    heroPageSimpleTemplate: boolean;
    /** @description sports which has to be hidden (related with field `showHiddenSports`) */
    hiddenSportsList: string[]
    /** @description show / hide all casion game on Christmas day. */
    hideAllCasinoGamesOnChristmas: boolean,
    /** @description ... */
    homePageDefaultOrder: 'default' | 'eventsInPlayFirst' | 'mcbookie' | 'vickers' | 'rhino' | 'betzone' | 'planetsportbet';

    /* I */
    /** @description temporary flag while old signup is still active - old form input backgound change on visited field */
    inputVisitedBackgroundChange: boolean;
    /** @description insert income access pixel from data.id */
    insertIncomeAccessPixel: boolean;
    /** @description add icon ios in headerMeta */
    iosIconLink: boolean;
    /** @description enable Hero (previously Virtual) Events layout */
    isHeroEventEnabled: boolean;
    /** @description enable PromoSidebar for universe */
    isPromoSidebarAvailable: boolean;
    /** @description is Sentry error tracker enabled - there also has to be set SENTRY_DSN="true" in environment */
    isSentryEnabled: boolean;
    /** @description enable SignUp */
    isSignUpAvailable: boolean;
    /** @description decide if stream conmponent on Special Event should be controlled by time */
    isStreamControlledByTime: boolean;
    /** @description decide if stream component should be visible for unauthorized users */
    isStreamVisibleForUnauthorized: boolean;
    /** @description enable the account verification via SMS */
    isVerifyAccountWithSMSAvailable: boolean;
    /** @description enable ZenDesk in footer always */
    isZenDeskAlwaysEnabled: boolean;
    /** @description enable ZenDesk in footer when user is logged and is on the Casino page */
    isZenDeskAuthorizedCasinoEnabled: boolean;
    /** @description ... */
    isZenDeskAuthorizedWhenSignupVisible: boolean;

    /* K */
    /** @description show button to hide keyboard */
    keyboardHideButton: boolean;

    /* L */
    /** @description Landing page universe info */
    landingPageSignupUniverseInfo: string
    /** @description DGA for live casino */
    liveCasino: {
        dev: {
            host: string;
            casinoId: string;
        };
        prod: {
            host: string;
            casinoId: string;
        };
    };
    /** @description icon for live casino */
    liveCasinoIcon: 'iconDefault' | 'iconNebet';
    /** @description different icon for nebet */
    liveCasinoTokenIcon: boolean;
    /** @description input label type in login form */
    loginInputLabel: 'default' | 'mcbookie' | 'orbitalbet' | 'carousel' | 'bongos';
    /** @description input type in login form */
    loginInputType: 'email' | 'text';
    /** @description autologin after reset password success */
    loginOnResetPasswordSuccess: boolean;
    /** @description  -----FeaturesFlag => should be always FALSE----- */
    lottery: boolean;

    /* M */
    /** @description add link to manifest.json */
    manifestLink: boolean;
    /** @description switch to translate market header */
    marketTranslate: boolean;
    /** @description show message in message box wrapper */
    messageBoxCarousel: boolean;
    /** @description show Icon in error message */
    messageErrorIcon: boolean;
    /** @description show Icon in success message */
    messageSuccessIcon: boolean;

    /* N */
    /** @description switch to translate sport in navigation list */
    navigationListSport: boolean;
    /** @description show popular section */
    navigationPopular: boolean,
    /** @description show favourites section */
    navigationFavourites: boolean,
    /** @description show recently viewed section */
    navigationRecentlyViewed: boolean,
    /** @description set mobile navigation links different to the top nav/header ones or the same like top nav/header ones */
    navigationMobileLinks: 'special-links' | 'header-links';
    /** @description -----FeaturesFlag => should be always FALSE-----  */
    newSignup: boolean;
    /** @description check if message.payloadaction is not attempted deposit in top-up */
    notAttemptedDeposit: boolean;
    /** @description switch to render notifications */
    notificationsList: boolean;

    /* O */
    /** @description set 'd' to default format */
    oddsFormatDefault: boolean;
    /** @description show open bets in tabs */
    openBets: boolean;

    /* P */
    /** @description logo for 404 error page */
    pageNotFoundError: 'pageNotFoundErrorLogo' | 'Star404ErrorLogo' | 'McBookie404ErrorLogo' | 'Vickers404ErrorLogo' | 'Nebet404ErrorLogo' | 'Rhino404ErrorLogo' | 'BetZone404ErrorLogo' | 'PlanetSport404ErrorLogo',
    /** @description add additional elements and styles when 404 error page is not a default one */
    page404Default: boolean;
    /** @description show component with payout rules text */
    payoutRules: boolean;
    /** @description set title in confirm message in playBreak */
    playBreakConfirmWithTitle: boolean;
    /** @description show infoblock in signup procedure */
    playWithStarSportsInfoBlock: boolean;
    /** @description sort prefixes by countries id or by prefix */
    prefixesSortedByCountries: boolean;
    /** @description show price history line chart in racing */
    priceHistoryLineChart: boolean,

    /* R */
    /** @description -----FeaturesFlag => should be always FALSE----- */
    rab: boolean;
    /** @description decscription in YouDecideHeader (Unavailable for cashout) */
    rabCashoutAvailable: boolean;
    /** @description ... */
    rabHeaderIcon: 'YouDecideIcon' | 'BetBuilderIcon';
    /** @description title for rab header and bets */
    rabHeaderTitle: string;
    /** @description set names for racing page filter tabs */
    racingPageTabNames: 'default' | 'betzone-type';
    /** @description set title in confirm message in reality check */
    realityCheckConfirmWithTitle: boolean;
    /** @description set item route to localStorage recently visited */
    recentlyVisitedLocalStorage: boolean;
    /** @description after click recentlyVisited window move to top 0,0 */
    recentlyVisitedScrollToTop: boolean;
    /** @description redirect from home to landing page */
    redirectToLadingPage: boolean;
    /** @description reset password form */
    resetPasswordForm: 'ResetPasswordForm' | 'McBookieValidateAccountForm';
    /** @description company name in responsible gambling section in main footer */
    responsibleGamblingCompanyName: string;

    /* S */
    /** @description set scoreboard for sports = americanFootball, baseball, cricket, football, rugbyleague, rugbyunion, tennis */
    scoreboardAllSports: boolean;
    /** @description background type for american sport scoreboard (NBA/NHL/...) */
    scoreboardAmericanSportBg: 'star' | 'mcbookie' | 'nebet' | 'vickers' | 'rhino' | 'betzone' | 'planetsportbet';
    /** @description set scoreboard for sports = americanfootball, cricket, football, rugbyunion, tennis */
    scoreboardFiveSports: boolean;
    /** @description should display scoreboards for certain universe */
    scoreboardType: UniverseType;
    /** @description switch to carousel selections */
    selectionCarousel: boolean;
    /** @description switch to carousel selectionsCast */
    selectionCastCarousel: boolean;
    /** @description switch to carousel new selections */
    selectionNewVersionCarousel: boolean;
    /** @description display price model to fixed in selection view model */
    selectionViewPriceFixed: boolean;
    /** @description set title in confirm message in self exclision */
    selfExclusionConfirmWithTitle: boolean;
    /** @description  set affiliate from undefined to string in betting */
    setAffiliateInPlaceBet: boolean;
    /** @description  if true, silk is displayed without question mark */
    shouldDisplaySilkWithoutQuestionMark: boolean;
    /** @description if true and Image per page false display default header background */
    showDefaultSportPageHeaderImage: boolean;
    /** @description show golf on virtuals sports list */
    showGolfOnVirtuals: boolean;
    /** @description ... */
    showGreyhoundracingPageHeaderImage: boolean;
    /** @description show sports in lsports-disabled-list in sports list */
    showHiddenSports: boolean;
    /** @description ... */
    showHorseracingPageHeaderImage: boolean;
    /** @description show KycStatus */
    showKycStatus: boolean,
    /** @description ... */
    showRightSidebarOnErrorPage: boolean;
    /** @description show main header links connected with special events */
    showSpecialEventsHeaderLinks: boolean;
    /** @description  */
    signupDocumentProcedureOn: boolean;
    /** @description ... */
    signUpFacebookAppId: string | null;
    /** @description ... */
    signupFacebookProcedureOn: boolean;
    /** @description ... */
    signUpFooterMail: string;
    /** @description show sign up link in account navigation */
    signupLink: boolean;
    /** @description ... */
    signUpShowPromoCode: boolean;
    /** @description footer component set simple or datailed footer */
    simpleFooter: boolean;
    /** @description header meta css */
    siteVerificationMetaMap: {
        name: string,
        content: string
    } | null,
    /** @description turn on slice name in race label */
    sliceNameRaceLabel: boolean;
    /** @description slice url /content/pages/ */
    sliceUrlInContentPages: boolean;
    /** @description switch to carousel new sports page */
    sportsPageCarousel: boolean;
    /** @description show star events in navigation sidebar */
    starEvents: boolean;
    /** @description show star events in navigation sidebar label name */
    starEventsLabel: string;
    /** @description show info block in login tab */
    starSportsInfoBlock: boolean;
    /** @description header meta */
    styleMainSrc: 'starStyle' | 'nebetStyle' | 'mcbookieStyle' | 'vickersStyle' | 'rhinoStyle' | 'betZoneStyle' | 'planetSportStyle',

    /* T */
    /** @description -----FeaturesFlag => should be always FALSE-----  */
    timeoutToTestSignupFlow: boolean;
    /** @description set to disable button in topUpProcedure */
    topUpProcedureBtnDisabled: boolean;
    /** @description change title in deposit account  true = Deposit, false = Top up */
    topUpTitle: boolean;
    /** @description label for trader chat */
    traderChatLabel: 'default' | 'mcbookie';
    /** @description enable Trap Challenge */
    trapChallenge: boolean;
    /** @description set time format for tz(timezone) from moment */
    tzStartTimeMeetingsEvent: boolean;
    /** @description set start time format (tz) from moment */
    tzStartTimeQuickPickColumn: boolean;
    /** @description set time format for tz(timezone) from moment */
    tzStartTimeRaceLabel: boolean;
    /** @description set time format for tz(timezone) from moment */
    tzTimeFormatRaceBox: boolean;

    /* U */
    /** @description turn on component for unSupportedBrowsers */
    unSupportedBrowsers: boolean;
    /** @description set logo for unSupportedBrowsers component */
    unSupportedBrowsersLogo: 'StarsportsLogoIconWrapper' | 'NebetLogoWrapper' | 'McBookieLogoWrapper';
    /** @description turn on update quick bet in QuickBet */
    updateQuickBet: boolean;
    /** @description .... */
    usePaymentFormForUniverse: string;

    /* Z */
    /** @description key for zenDesk in footer */
    zendeskKey: string;
}

export type ConfigKeys = keyof ConfigTypes;

export const configTypesDesc = {
    /* A */
    accountHelperMail: 'account for help contact',
    accountNavigationHelpText: 'text Help in account navigation, default text is FAQ',
    accountNavSignUpIcon: 'signup icon \'star-fill\' | \'mcbookie-logo\' | \'nebet-logo\'',
    addGameToHistoryProviderGameId: 'put game to history with providerGame, if false u put nyxGameid',
    affiliateChangeInSignup: 'change affiliate if props are change in signup procedure',
    affiliates: 'show link to affiliates in footer',
    apiEventListIncludes: '',
    autoLogoutUser: 'auto logout user and show message box with session expire',

    /* B */
    backspaceButton: 'show beckspace button in betting custom keyboard',
    betslipCarousel: 'switch to new carousel betslip',
    betslipCarouselInBettingTab: 'switch to new carousel betslip in betting Tab',
    betslipHeaderWithCloseAll: 'show betslip header with "remove all" icon and playwithStarSportsInfoBlock',
    betSlipLocalStorage: 'get bets from localStorage to reduxState',
    betslipReceiptClose: 'close betslip receipt after 3 sec',
    bettingTabCarousel: 'switch to carousel bettingTab',
    bogCard: 'show bogcard from market.bp in quickPickColumn',
    bogIndicatorType: 'bog indicator type default | star',

    /* C */
    callDelayPromise: 'set if bets call with delayPrimise in place-bet',
    cashoutIconDisplay: 'display cash out icon for events and markets',
    circleArrow: ' display account arrow in circle',
    consoleWarnBetslipTranslation: 'add console.warn in BetslipTranslation',
    consoleWarnTranslateFormErrors: ' add console.warn in translateFormError',
    consoleWarnTranslateSport: 'add console.warn in translateSports',
    contactUsList: 'contacts for Contact Us section in main footer',
    cookiesPolicyBox: 'show cookiesPolicy box in the bottom of the page',
    currencyEuroDefault: 'set default euro currency',
    casinoGameImg: 'image for casino game',
    casinoLaunchGameModalLogo: 'logo for casino launch game modal',
    couponForEnv: 'coupon for environment',

    /* D */
    dateRangeButton: 'turn on button wrapper in dateRange',
    depositLimitsText: ' Deposit Limits text in Topup limits procedure, default text is Top Up Limits',
    displayTranslatedSelectionName: 'display translated selection name in SelectionGroup',

    /* E */
    emailKycWarning: 'email to kyc warning',
    eventsEuropeanEliteMcbookie: 'get ids europeanEliteTemplate from template mcbookie',
    eventsMarketsCarousel: ' switch to carousel events markets',
    eventsOnLaterHomePage: 'if route is starEvents show only eventsOnlater in mid layout',
    eventsTableFilterGroup: 'show events filter in eventTable',
    eventsTablePriceLegend:'show price legend in events table',
    eventStreaming: 'show icons and buttons for live event stream',

    /* F */
    footerCopyrightType: 'set type of copyright text in main footer',
    forgotPasswordInputLabel: 'input label type in forgot password form',
    forgotPasswordInputType: 'input type in forgot password form `email` | `text`',
    formInputDisabledClass: 'add disabled class to form input',
    formInputFontLarger: 'change font-size input to 13px, default is 12px',
    formNewInputAddClassError: ' add error class in form new input',
    freeBetTax: 'get free bet tax from betslip',

    /* G */
    gamStopConfirmationBox: 'show gamStop text in confirmation box',
    getGameCasinoChangeHref: ' change href for game.bodyJson.url in get Game casino',
    googleAnalyticsID: 'google id for analytics',
    googleAnalyticsOptimizeID: 'google optimize id for google tag manager',
    googleAnalyticsTagManager: ' google tag to google tag manager',
    googleExperimentIdDev: 'google optimize experiment id for dev',
    googleExperimentIdProd: 'google optimize experiment id for production',

    /* H */
    hasAlternativeBalancesVisible: 'turn on/off alternative banace on website',
    hasCashoutEnabled: 'turn on/off able to cashout',
    hasCasinoEnabled: 'turn on/off casino',
    hasFaqSection: ' turn on/off faq section',
    hasFreeBetCreditsEnabled: 'turn on/off free bet credits',
    hasInPlayDelayInformation: 'turn on delay information in InPlayComponent',
    hasLanguageSwitcherInAccountMenu: 'turn on/off switcher lang in account menu',
    hasMaxBetEnabled: 'turn on/off limit to bet',
    hasNeedHelpAccountSection: 'turn on/off section with help in account',
    hasPromoCodeOnRegistrationAvailable: 'turn on/off promo code in registration',
    hasTopUpEnabled: 'turn on/off top up in betslip',
    hasTraderChat: 'turn on/off trader chat',
    hasUserAddressChangeEnabled: 'turn on/off able to change address',
    hasUserContactNumberChangeEnabled: 'turn on/off able to change contact number',
    hasUserEmailChangeEnabled: ' turn on/off able to change email address',
    hiddenSportsList: 'sports which have to be hidden (related with field `showHiddenSports`)',
    homePageDefaultOrder: '\'default\' | \'eventsInPlayFirst\' | \'mcbookie\' | \'vickers\'',

    /* I */
    insertIncomeAccessPixel: 'insert income access pixel from data.id',
    iosIconLink: 'add icon ios in headerMeta',
    isHeroEventEnabled: 'enable Hero (previously Virtual) Events layout',
    isPromoSidebarAvailable: 'enable PromoSidebar for universe',
    isSentryEnabled: 'is Sentry error tracker enabled - there also has to be set SENTRY_DSN="true" in environment',
    isSignUpAvailable: 'enable SignUp',
    isVerifyAccountWithSMSAvailable: 'enable the account verification via SMS',
    isZenDeskAlwaysEnabled: 'enable ZenDesk in footer always',
    isZenDeskAuthorizedCasinoEnabled:'enable ZenDesk in footer when user is logged and is on the Casino page',
    isZenDeskAuthorizedWhenSignupVisible: '',

    /* K */
    keyboardHideButton: 'show button to hide keyboard',

    /* L */
    liveCasino: 'DGA for live casino',
    liveCasinoTokenIcon: 'different icon for nebet',
    loginInputLabel: 'input label type in login form',
    loginInputType: ' input type in login form `email` | `text',
    loginOnResetPasswordSuccess: 'autologin after reset password success',
    lottery: 'show lottery components',

    /* M */
    manifestLink: 'add link to manifest.json',
    marketTranslate: 'switch to translate market header',
    messageBoxCarousel: 'show message in message box wrapper',
    messageErrorIcon: 'show Icon in error message',
    messageSuccessIcon: 'show Icon in success message',

    /* N */
    navigationListSport: 'switch to translate sport in navigation list',
    navigationPopular: 'show popular section',
    navigationFavourites: 'show favourites section',
    navigationSideBarShowChevronOnDesktop: 'switch to show chevrons on navigation sidebar desktop',
    navigationSideBarShowChevronOnMobile: 'switch to show chevrons on navigation sidebar mobile',
    newSignup: 'use new form with hello soda',
    notAttemptedDeposit: 'check if message.payloadaction is not attempted deposit in top-up',
    notificationsList: 'switch to render notifications',

    /* O */
    oddsFormatDefault: 'set `d` to default format',
    openBets: 'show open bets in tabs',

    /* P */
    pageNotFoundError: 'pageNotFoundErrorLogo | Star404ErrorLogo | McBookie404ErrorLogo | Vickers404ErrorLogo | Nebet404ErrorLogo',
    payoutRules: 'show component with payout rules text',
    playBreakConfirmWithTitle: 'set title in confirm message in playBreak',
    playWithStarSportsInfoBlock: 'show infoblock in signup procedure',
    prefixesSortedByCountries: 'sort prefixes by countries id or by prefix',

    /* R */
    rab: 'turn on RAB events',
    rabCashoutAvailable: 'decscription in YouDecideHeader (Unavailable for cashout)',
    rabHeaderIcon: 'YouDecideIcon | BetBuilderIcon',
    rabHeaderTitle: 'title for rab header and bets',
    realityCheckConfirmWithTitle: 'set title in confirm message in reality check',
    recentlyVisitedLocalStorage: 'set item route to localStorage recently visited',
    recentlyVisitedScrollToTop: 'after click recentlyVisited window move to top 0,0',
    redirectToLadingPage: 'redirect from home to landing page',
    resetPasswordForm: 'reset password form ResetPasswordForm | McBookieValidateAccountForm',

    /* S */
    scoreboardAllSports: 'set scoreboard for sports = americanFootball, baseball, cricket, football, rugbyleague, rugbyunion, tennis',
    scoreboardAmericanSportBg: 'background type for american sport scoreboard (NBA/NHL/...)',
    scoreboardFiveSports: 'set scoreboard for sports = americanfootball, cricket, football, rugbyunion, tennis',
    scoreboardType: ' should display scoreboards for certain universe',
    selectionCarousel: 'switch to carousel selections',
    selectionCastCarousel: 'switch to carousel selectionsCast',
    selectionNewVersionCarousel: 'switch to carousel new selections',
    selectionViewPriceFixed: 'display price model to fixed in selection view model',
    selfExclusionConfirmWithTitle: 'set title in confirm message in self exclision',
    setAffiliateInPlaceBet: 'set affiliate from undefined to string in betting',
    showDefaultSportPageHeaderImage: 'if true and Image per page false display default header background',
    showGreyhoundracingPageHeaderImage: '',
    showHiddenSports: 'show sports in lsports-disabled-list in sports list',
    showHorseracingPageHeaderImage: '',
    showRightSidebarOnErrorPage: '',
    signupDocumentProcedureOn: 'Turn on Document procedure',
    signUpFacebookAppId: '',
    signupFacebookProcedureOn: 'Turn on Facebook procedure',
    signUpFooterMail: '',
    signUpFooterText: '',
    signupLink: 'show sign up link in account navigation',
    signUpShowPromoCode: '',
    simpleFooter: 'footer component set simple or datailed footer',
    sliceNameRaceLabel: 'turn on slice name in race label',
    sliceUrlInContentPages: ' slice url /content/pages/',
    sportsPageCarousel: 'switch to carousel new sports page',
    starEvents: 'show star events in navigation sidebar',
    starSportsInfoBlock: 'show info block in login tab',

    /* T */
    timeoutToTestSignupFlow: 'use to change customer settings in BO',
    topUpProcedureBtnDisabled:'set to disable button in topUpProcedure',
    topUpTitle: 'change title in deposit account  true = Deposit, false = Top up',
    traderChatLabel: ' label for trader chat',
    tzStartTimeMeetingsEvent: 'set time format for tz(timezone) from moment',
    tzStartTimeQuickPickColumn: ' set start time format (tz) from moment',
    tzStartTimeRaceLabel: 'set time format for tz(timezone) from moment',
    tzTimeFormatRaceBox: 'set time format for tz(timezone) from moment',

    /* U */
    updateQuickBet: 'turn on update quick bet in QuickBet',
    unSupportedBrowsers: 'turn on component for unSupportedBrowsers',
    unSupportedBrowsersLogo: 'set logo for unSupportedBrowsers component',
    usePaymentFormForUniverse: '',

    /* Z */
    zendeskKey: 'key for zenDesk in footer',
};


/*
    Prod - Star
host: "dga.pragmaticplaylive.net",
casinoId: "ppcdg00000004198",

    Prod - Mcbookie
host: "dga.pragmaticplaylive.net",
casinoId: "ppcdg00000004197",

    Prod - NeBet
host: "dga.pragmaticplaylive.net",
casinoId: "ppcdg00000004199",

    STG - NeBet
host: "prelive-dga.pragmaticplaylive.net",
casinoId: "ppcdk00000005026",

    STG - Mcbookie
host: "prelive-dga.pragmaticplaylive.net",
casinoId: "ppcdk00000005025",
    */
