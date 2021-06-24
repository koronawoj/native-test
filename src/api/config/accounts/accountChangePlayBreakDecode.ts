import { decodeArrayOrUndefined } from './../../utils/commonModelValidators';
import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import { buildModelValidator, buildApiItemDefault } from 'src/api/utils/modelUtils';
import {
    decodeNumberOrNull,
    decodeBoolean,
    decodeString,
    decodeStringOrNull,
    decodeStringArr,
    decodeNumber,
    decodeBooleanOrNull,
    buildOptionalDecoderModel
} from 'src/api/utils/commonModelValidators';

const decodePhone = buildValidator('Phone', t.interface({
    country: t.string,
    number: t.string,
    prefix: t.string,
}));

const modelConfig = {
    addressLine1: buildApiItemDefault(decodeString, ''),
    addressLine2: buildApiItemDefault(decodeStringOrNull, null),
    ageVerification: buildApiItemDefault(decodeString, ''),
    amlStatus: buildApiItemDefault(decodeString, ''),
    amlWatchlist: buildApiItemDefault(decodeBoolean, false),
    antePostRules: buildApiItemDefault(decodeBoolean, false),
    assetFlowsUrl: buildApiItemDefault(decodeString, ''),
    bankAccountNumber: buildApiItemDefault(decodeStringOrNull, null),
    bankAccountSortCode: buildApiItemDefault(decodeStringOrNull, null),
    bankingConfig: buildApiItemDefault(
        buildValidator('', t.interface({
            provider: t.string,
        })),
        null
    ),
    betReferralEnabled: buildApiItemDefault(decodeBoolean, false),
    birthDate: buildApiItemDefault(decodeString, ''),
    bpEnabled: buildApiItemDefault(decodeBoolean, false),
    cancelWithdrawal: buildApiItemDefault(decodeBooleanOrNull, false),
    cashoutEnabled: buildApiItemDefault(decodeBoolean, false),
    chatEnabled: buildApiItemDefault(decodeBoolean, false),
    city: buildApiItemDefault(decodeString, ''),
    commission: buildApiItemDefault(decodeBoolean, false),
    contactPreferences: buildApiItemDefault(decodeStringArr, []),
    coolingOffPeriodHours: buildApiItemDefault(decodeNumberOrNull, null),
    country: buildApiItemDefault(decodeString, ''),
    county: buildApiItemDefault(decodeStringOrNull, null),
    creditAccount: buildApiItemDefault(decodeBoolean, false),
    creditLimit: buildApiItemDefault(decodeNumber, 0),
    creditPaymentTerms: buildApiItemDefault(decodeString, ''),
    currency: buildApiItemDefault(decodeString, ''),
    dailyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    dailyDepositLimitDateSet: buildApiItemDefault(decodeStringOrNull, null),
    dailyDepositLimitRequestDate: buildApiItemDefault(decodeStringOrNull, null),
    depositLimits: buildApiItemDefault(
        buildValidator('', t.interface({
            daily: t.unknown,
            monthly: t.unknown,
            url: t.unknown,
            weekly: t.unknown
          })),
          null
    ),
    email: buildApiItemDefault(decodeString, ''),
    failedLoginAttempts: buildApiItemDefault(decodeNumber, 0),
    firstName: buildApiItemDefault(decodeString, ''),
    gamStopVerification: buildApiItemDefault(decodeString, ''),
    id: buildApiItemDefault(decodeNumber, 0),
    incomeaccess: buildApiItemDefault(decodeStringOrNull, null),
    isHVC: buildApiItemDefault(decodeBoolean, false),
    kycEnabled: buildApiItemDefault(decodeBoolean, false),
    kycRequestExpireDate: buildApiItemDefault(decodeStringOrNull, null),
    kycStatus: buildApiItemDefault(decodeString, ''),
    landlinePhone: buildApiItemDefault(buildOptionalDecoderModel(decodePhone), null),
    linkedUniverses: buildApiItemDefault(buildValidator('', t.array(t.string)), []),
    loggedTime: buildApiItemDefault(decodeNumber, 0),
    mailingEnabled: buildApiItemDefault(decodeBoolean, false),
    marketing: buildApiItemDefault(decodeBooleanOrNull, null),
    mobilePhone: buildApiItemDefault(buildOptionalDecoderModel(decodePhone), null),
    monthlyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    monthlyDepositLimitDateSet: buildApiItemDefault(decodeStringOrNull, null),
    monthlyDepositLimitRequestDate: buildApiItemDefault(decodeStringOrNull, null),
    name: buildApiItemDefault(decodeString, ''),
    oddsFormat: buildApiItemDefault(decodeString, ''),
    openBets: buildApiItemDefault(decodeNumber, 0),
    passwordResetToken: buildApiItemDefault(
        buildValidator('', t.union([
            t.interface({
                sourceIp: t.string,
                token: t.string,
                validFrom: t.number,
                validTo: t.number,
                sentVia: t.string,
                attempts: t.number
            }),
            t.null
        ])),
        null
    ),
    passwordResetTokenUrl: buildApiItemDefault(decodeString, ''),
    playBreakDuration: buildApiItemDefault(decodeNumberOrNull, null),
    playBreakExpiry: buildApiItemDefault(decodeStringOrNull, null),
    playBreakRequestDate: buildApiItemDefault(decodeStringOrNull, null),
    postCode: buildApiItemDefault(decodeString, ''),
    printedStatement: buildApiItemDefault(decodeBoolean, false),
    promoID: buildApiItemDefault(decodeNumberOrNull, null),
    quickBetReferralEnabled: buildApiItemDefault(decodeBoolean, false),
    reactivationRequestedDate: buildApiItemDefault(decodeStringOrNull, null),
    realityCheck: buildApiItemDefault(
        buildValidator('', t.interface({
            active: t.union([t.interface({}), t.null]),
            pending: t.union([t.interface({}), t.null])
        })),
        null
    ),
    realityCheckFrequencyDateSet: buildApiItemDefault(decodeStringOrNull, null),
    realityCheckFrequencyRequestDate: buildApiItemDefault(decodeStringOrNull, null),
    referrer: buildApiItemDefault(decodeStringOrNull, null),
    requestedDailyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    requestedMonthlyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    requestedRealityCheckFrequency: buildApiItemDefault(decodeNumberOrNull, null),
    requestedWeeklyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    resetPasswordUrl: buildApiItemDefault(decodeString, ''),
    revision: buildApiItemDefault(decodeNumber, 0),
    ringFencedFunds: buildApiItemDefault(decodeBoolean, false),
    roles: buildApiItemDefault(decodeStringArr, []),
    securityNotes: buildApiItemDefault(decodeStringOrNull, null),
    selfExclusionDate: buildApiItemDefault(decodeStringOrNull, null),
    selfExclusionDuration: buildApiItemDefault(decodeNumberOrNull, null),
    selfExclusionExpiry: buildApiItemDefault(decodeStringOrNull, null),
    stakeFactor: buildApiItemDefault(decodeNumber, 0),
    stakeFactorInPlaySports: buildApiItemDefault(buildValidator('', t.array(t.unknown)), []),
    stakeFactorInPlay: buildApiItemDefault(decodeNumber, 0),
    stakeFactorSports: buildApiItemDefault(buildValidator('', t.array(t.unknown)), []),
    statementFrequency: buildApiItemDefault(decodeString, ''),
    statementsUrl: buildApiItemDefault(decodeString, ''),
    status: buildApiItemDefault(decodeString, ''),
    statusDescription: buildApiItemDefault(decodeStringOrNull, null),
    surname: buildApiItemDefault(decodeString, ''),
    telebettingId: buildApiItemDefault(decodeStringOrNull, null),
    telebettingPassword: buildApiItemDefault(decodeStringOrNull, null),
    terms: buildApiItemDefault(
        buildValidator('', t.union([ t.boolean, t.null ])),
        null
    ),
    title: buildApiItemDefault(decodeString, ''),
    tradingNotes: buildApiItemDefault(decodeStringOrNull, null),
    transactionUrl: buildApiItemDefault(decodeString, ''),
    transactions: buildApiItemDefault(decodeArrayOrUndefined, []),
    type: buildApiItemDefault(decodeString, ''),
    universe: buildApiItemDefault(decodeString, ''),
    universePrefix: buildApiItemDefault(decodeString, ''),
    url: buildApiItemDefault(decodeString, ''),
    wallet: buildApiItemDefault(buildValidator('', t.unknown), {}),
    walletUrl: buildApiItemDefault(decodeString, ''),
    watchlist: buildApiItemDefault(decodeBoolean, false),
    weeklyDepositLimit: buildApiItemDefault(decodeNumberOrNull, null),
    weeklyDepositLimitDateSet: buildApiItemDefault(decodeStringOrNull, null),
    weeklyDepositLimitRequestDate: buildApiItemDefault(decodeStringOrNull, null),
};

export const decodeAccountChangePlayBreak = buildModelValidator('Accounts play break', modelConfig);

export type AccountPlayBreakModelType = ReturnType<typeof decodeAccountChangePlayBreak>;

export type AccountPlayBreakError = {
    status: number,
    error: {
        error: string
    }
}
