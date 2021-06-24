import { accountRealityCheckDataUpdate } from 'src/api/config/accounts/accountRealityCheckDataUpdate';
import { accountBonusesData } from 'src/api/config/accounts/accountBonusesData';
import { createWebApiDriverItemOld, createWebApiDriverItem } from 'src_common/browser/apiUtils';
import { accountBasicData } from 'src/api/config/accounts/accountBasicData';
import { accountWalletData } from 'src/api/config/accounts/accountWalletData';
import { accountFreeBetsData } from 'src/api/config/accounts/accountFreeBetsData';
import { accountSavedPaymentMethod } from 'src/api/config/accounts/accountSavedPaymentMethods';
import { backofficeDeposits } from 'src/api/config/accounts/backofficeDeposits';
import { accountAllBetsData } from 'src/api/config/accounts/accountAllBetsData';
import { accountDepositLimitsData } from 'src/api/config/accounts/accountDepositLimitsData';
import { accountRealityCheckData } from 'src/api/config/accounts/accountRealityCheckData';
import { accountBankingConfigs } from 'src/api/config/accounts/accountBankingConfigs';
import { accountChangeEmail } from 'src/api/config/accounts/accountChangeEmail';
import { getF1ParticipantsCMS } from 'src/api/config/cms/getF1RacersDataFromCMS';
import { getF1OverviewCMS } from 'src/api/config/cms/getF1OverviewFromCMS';
import { changeOddsFormat } from 'src/api/config/accounts/changeOddsFormat';
import { accountFindAddress } from 'src/api/config/accounts/accountFindAddress';
import { getSilksFromCMS } from 'src/api/config/cms/getSilksFromCMS';
import { accountContactPreferences } from 'src/api/config/accounts/accountContactPreferences';
import { accountRequestPasswordReset } from 'src/api/config/accounts/accountRequestPasswordReset';
import { accountNetDepositsData } from 'src/api/config/accounts/accountNetDepositsData';
import { accountChangePassword } from 'src/api/config/accounts/accountChangePassword';
import { accountChangePhoneNumber } from 'src/api/config/accounts/accountChangePhoneNumber';
import { updateTopUpLimits } from 'src/api/config/accounts/accountUpdateTopUpLimits';
import { accountRequestPasswordResetValidate } from 'src/api/config/accounts/accountRequestPasswordResetValidate';
import { accountChangePlayBreak } from 'src/api/config/accounts/accountChangePlayBreak';
import { staticPagesDataCMS } from 'src/api/config/cms/getStaticPageCMS';
import { accountSelfExclusionData } from 'src/api/config/accounts/accountSelfExclusionData';
import { getPopularSports } from 'src/api/config/popularSports/getPopularSports';
import { getNotifications } from 'src/api/config/cms/getNotifications';
import { getEventOverviewData } from 'src/api/config/cms/getEventOverviewData';
import { getPromoTermsConditions } from 'src/api/config/cms/getT&CPromos';
import { accountAddressDetails } from 'src/api/config/accounts/accountAddressDetails';
import { accountValidateEmail } from 'src/api/config/accounts/accountValidateEmailData';
import { getVirtualSports } from 'src/api/config/virtualSports/getVirtualSports';
import { getLiveCasinoGames } from 'src/api/config/liveCasino/getLiveCasinoGames';
import { getLiveCasinoDemoGames } from 'src/api/config/liveCasino/getLiveCasinoDemoGames';
import { getLiveCasinoGamesUri } from 'src/api/config/liveCasino/getLiveCasinoGameUri';
import { getLiveCasinoDemoGamesUri } from 'src/api/config/liveCasino/getLiveCasinoDemoGameUri';
import { getLiveCasinoBanner } from 'src/api/config/liveCasino/getLiveCasinoBanner';
import { getLiveCasinoCategories } from 'src/api/config/liveCasino/getLiveCasinoCategories';
import { rabGetPrice } from 'src/api/config/eventsRab/rabGetPrice';
import { accountChangeRingFencedFunds } from 'src/api/config/accounts/accountChangeRingFencedFunds';
import { accountTopUpData } from 'src/api/config/accounts/accountTopUpProcedure';
import { createAccount } from 'src/api/config/accounts/createAccount';
import { accountGetMarketingQuestions } from 'src/api/config/accounts/marketingQuestions/accountGetMarketingQuestions';
import { accountUpdateMarketingQuestion } from 'src/api/config/accounts/marketingQuestions/accountUpdateMarketingQuestion';
import { getReferredBetSlip } from 'src/api/config/betting/getReferredBetSlip';
import { cashOutsData } from 'src/api/config/betting/cashOutsData';
import { retrieveCashOut } from 'src/api/config/betting/retrieveCashOut';
import { getRMGStream } from 'src/api/config/streaming/getRMGStream';
import { getHeroParticipant } from 'src/api/config/cms/getHeroParticipant';
import { getCheckBetForEvent } from 'src/api/config/streaming/checkBetForEvent';
import { getAtrStream } from 'src/api/config/streaming/getAtrStream';
import { getChatStatus } from 'src/api/config/traderChat/getChatStatus';
import { getChatTemplates } from 'src/api/config/traderChat/getChatTemplates';
import { getChatData } from 'src/api/config/traderChat/getChatData';
import { sendChatMessage } from 'src/api/config/traderChat/sendChatMessage';
import { casinoGetCategories } from 'src/api/config/casino/casinoGetCategories';
import { casinoGetGames } from 'src/api/config/casino/casinoGetGames';
import { casinoGetBanners } from 'src/api/config/casino/casinoGetBanners';
import { casinoGetBannersConfig } from 'src/api/config/casino/casinoGetBannersConfig';
import { casinoGetGameDetails } from 'src/api/config/casino/casinoGetGameDetails';
import { verifyProfileViaFacebook } from 'src/api/config/hello-soda/verifyProfileViaFacebook';
import { withdrawals } from 'src/api/config/accounts/accountsWithdrawals';
import { withdrawalsNew } from 'src/api/config/accounts/accountsWithdrawalsNew';
import { cancelWithdrawal } from 'src/api/config/accounts/accountsCancelWithdrawal';
import { casinoSetFavourite } from 'src/api/config/casino/casinoSetFavourite';
import { casinoSetRating } from 'src/api/config/casino/casinoSetRating';
import { setDepositLimit } from 'src/api/config/accounts/accountSetDepositLimits';
import { loginRequest } from 'src/api/config/accounts/login';
import { accountStatus } from 'src/api/config/accounts/accountStatus';
import { getActualLottery } from 'src/api/config/lottery/getActualLottery';
import { postOrderLottery } from 'src/api/config/lottery/postOrderLottery';
import { getPendingLottery } from 'src/api/config/lottery/getPendingLottery';
import { getSettledLottery } from 'src/api/config/lottery/getSettledLottery';
import { getPreviousDrawsLottery } from 'src/api/config/lottery/getPreviousDrawsLottery';
import { verifyProfileViaDocument } from './config/hello-soda/verifyProfileViaDocument';
import { getLotteryNotifications } from './config/lottery/getLotteryNotifications';
import { postLotteryNotificationsConfirmed } from './config/lottery/postLotteryNotificationsConfirmed';
import { ping } from './config/session/ping';
import { accountTransactionsData } from './config/accounts/accountTransactionHistoryData';
import { navigationHeaderLinksActive } from './config/cms/navigationHeaderActiveLinks';
import { get_promo_notifications_active } from './config/cms_new/promo_notifications/get_promo_notifications_active';
import { get_landing_page_active } from './config/cms_new/promo_notifications/get_landing_page_active';
import { findPage } from './config/cms_new/pages/find_page';
import { verifyCounter } from './config/hello-soda/verifyCounter';
import { get_hero_widget_active } from './config/cms_new/hero_widget/get_hero_widget_active';
import { logoutRequest } from './config/accounts/logut';
import { get_alternative_event_details_active } from './config/cms_new/alternative_event_details/get_alternative_event_details_active';
import { getLiveNotificationsActive } from './config/cms_new/liveNotificationsActive/getLiveNotificationsActive';
import { getCasinoBanners } from './config/cms_new/casino_banners/get_casino_banners';
import { getUserFavouritesSport } from './config/cms/getUserFavouritesSport';
import { postUserFavouritesSport } from './config/cms/postUserFavouritesSport';
import { getMarketFiltersForSport } from './config/cms_new/marketFilters/getMarketFiltersForSport';
import { getLiveCasinoBanners } from './config/cms_new/casino_banners/get_live_casino_banners';
import { getVirtualsBanners } from './config/cms_new/casino_banners/get_virtuals_banners';
import { getActiveSpecialSports } from './config/cms/getActiveSpecialSports';

export const configCommon = {
    ping: createWebApiDriverItem(ping),
    accountBasicData: createWebApiDriverItemOld(accountBasicData),
    accountWalletData: createWebApiDriverItem(accountWalletData),
    accountFreeBetsData: createWebApiDriverItemOld(accountFreeBetsData),
    accountAllBetsData: createWebApiDriverItem(accountAllBetsData),
    accountSavedPaymentMethod: createWebApiDriverItem(accountSavedPaymentMethod),
    accountDepositLimitsData: createWebApiDriverItem(accountDepositLimitsData),
    accountRealityCheckData: createWebApiDriverItem(accountRealityCheckData),
    accountBankingConfigs: createWebApiDriverItem(accountBankingConfigs),
    backofficeDeposits: createWebApiDriverItemOld(backofficeDeposits),
    accountRequestPasswordReset: createWebApiDriverItemOld(accountRequestPasswordReset),
    accountRequestPasswordResetValidate: createWebApiDriverItemOld(accountRequestPasswordResetValidate),
    accountChangeEmail: createWebApiDriverItemOld(accountChangeEmail),
    accountFindAddress: createWebApiDriverItem(accountFindAddress),
    accountAddressDetails: createWebApiDriverItem(accountAddressDetails),
    staticPagesDataCMS: createWebApiDriverItem(staticPagesDataCMS),
    getSilksFromCMS: createWebApiDriverItemOld(getSilksFromCMS),
    getF1ParticipantsCMS: createWebApiDriverItemOld(getF1ParticipantsCMS),
    getF1OverviewCMS: createWebApiDriverItemOld(getF1OverviewCMS),
    changeOddsFormat: createWebApiDriverItemOld(changeOddsFormat),
    accountContactPreferences: createWebApiDriverItemOld(accountContactPreferences),
    rabGetPrice: createWebApiDriverItem(rabGetPrice),
    accountBonusesData: createWebApiDriverItem(accountBonusesData),
    accountChangePhoneNumber: createWebApiDriverItemOld(accountChangePhoneNumber),
    accountNetDepositsData: createWebApiDriverItem(accountNetDepositsData),
    accountTransactionHistory: createWebApiDriverItem(accountTransactionsData),
    accountChangePassword: createWebApiDriverItemOld(accountChangePassword),
    updateTopUpLimits: createWebApiDriverItem(updateTopUpLimits),
    accountSetDepositLimit: createWebApiDriverItem(setDepositLimit),
    accountChangePlayBreak: createWebApiDriverItemOld(accountChangePlayBreak),
    accountRealityCheckDataUpdate: createWebApiDriverItemOld(accountRealityCheckDataUpdate),
    accountSelfExclusionData: createWebApiDriverItemOld(accountSelfExclusionData),
    getNotifications: createWebApiDriverItem(getNotifications),
    getPopularSports: createWebApiDriverItem(getPopularSports),
    getEventOverviewData: createWebApiDriverItem(getEventOverviewData),
    accountValidateEmail: createWebApiDriverItem(accountValidateEmail),
    getVirtualSports: createWebApiDriverItem(getVirtualSports),
    getLiveCasinoGames: createWebApiDriverItem(getLiveCasinoGames),
    getLiveCasinoDemoGames: createWebApiDriverItem(getLiveCasinoDemoGames),
    getLiveCasinoGamesUri: createWebApiDriverItem(getLiveCasinoGamesUri),
    getLiveCasinoDemoGamesUri: createWebApiDriverItem(getLiveCasinoDemoGamesUri),
    getLiveCasinoBanner: createWebApiDriverItem(getLiveCasinoBanner),
    getLiveCasinoCategories: createWebApiDriverItem(getLiveCasinoCategories),
    get_landing_page_active: createWebApiDriverItem(get_landing_page_active),
    findPage: createWebApiDriverItem(findPage),
    getPromoTermsConditions: createWebApiDriverItem(getPromoTermsConditions),
    accountChangeRingFencedFunds: createWebApiDriverItem(accountChangeRingFencedFunds),
    accountTopUpData: createWebApiDriverItem(accountTopUpData),
    createAccount: createWebApiDriverItem(createAccount),
    accountGetMarketingQuestions: createWebApiDriverItem(accountGetMarketingQuestions),
    accountUpdateMarketingQuestion: createWebApiDriverItem(accountUpdateMarketingQuestion),
    getReferredBetSlip: createWebApiDriverItem(getReferredBetSlip),
    cashOutsData: createWebApiDriverItem(cashOutsData),
    retrieveCashOut: createWebApiDriverItem(retrieveCashOut),
    getHeroParticipant: createWebApiDriverItemOld(getHeroParticipant),
    checkBetForEvent: createWebApiDriverItem(getCheckBetForEvent),
    getRMGStream: createWebApiDriverItem(getRMGStream),
    getAtrStream: createWebApiDriverItem(getAtrStream),
    getChatStatus: createWebApiDriverItem(getChatStatus),
    getChatTemplates: createWebApiDriverItem(getChatTemplates),
    getChatData: createWebApiDriverItem(getChatData),
    sendChatMessage: createWebApiDriverItem(sendChatMessage),
    casinoGetCategories: createWebApiDriverItem(casinoGetCategories),
    casinoGetGames: createWebApiDriverItem(casinoGetGames),
    casinoGetBanners: createWebApiDriverItem(casinoGetBanners),
    casinoGetBannersConfig: createWebApiDriverItem(casinoGetBannersConfig),
    casinoGetGameDetails: createWebApiDriverItem(casinoGetGameDetails),
    casinoSetFavourite: createWebApiDriverItem(casinoSetFavourite),
    casinoSetRating: createWebApiDriverItem(casinoSetRating),
    verifyProfileViaFacebook: createWebApiDriverItem(verifyProfileViaFacebook),
    verifyProfileViaDocument: createWebApiDriverItem(verifyProfileViaDocument),
    withdrawals: createWebApiDriverItem(withdrawals),
    withdrawalsNew: createWebApiDriverItem(withdrawalsNew),
    cancelWithdrawal: createWebApiDriverItem(cancelWithdrawal),
    login: createWebApiDriverItem(loginRequest),
    accountStatus: createWebApiDriverItem(accountStatus),
    actualLottery: createWebApiDriverItem(getActualLottery),
    getLotteryNotifications: createWebApiDriverItem(getLotteryNotifications),
    postLotteryNotificationsConfirmed: createWebApiDriverItem(postLotteryNotificationsConfirmed),
    postOrderLottery: createWebApiDriverItem(postOrderLottery),
    getPendingLottery: createWebApiDriverItem(getPendingLottery),
    getSettledLottery: createWebApiDriverItem(getSettledLottery),
    getPreviousDrawsLottery: createWebApiDriverItem(getPreviousDrawsLottery),
    navigationHeaderLinksActive: createWebApiDriverItem(navigationHeaderLinksActive),
    get_promo_notifications_active: createWebApiDriverItem(get_promo_notifications_active),
    verifyCounter: createWebApiDriverItem(verifyCounter),
    get_hero_widget_active: createWebApiDriverItem(get_hero_widget_active),
    logoutUser: createWebApiDriverItem(logoutRequest),
    get_alternative_event_details_active: createWebApiDriverItem(get_alternative_event_details_active),
    getLiveNotificationsActive: createWebApiDriverItem(getLiveNotificationsActive),
    getCasinoBanners: createWebApiDriverItem(getCasinoBanners),
    getLiveCasinoBanners: createWebApiDriverItem(getLiveCasinoBanners),
    getVirtualsBanners: createWebApiDriverItem(getVirtualsBanners),
    getUserFavouritesSport: createWebApiDriverItem(getUserFavouritesSport),
    postUserFavouritesSport: createWebApiDriverItem(postUserFavouritesSport),
    getMarketFiltersForSport: createWebApiDriverItem(getMarketFiltersForSport),

    getActiveSpecialSports: createWebApiDriverItem(getActiveSpecialSports),
};

export const apiCommon = configCommon;
