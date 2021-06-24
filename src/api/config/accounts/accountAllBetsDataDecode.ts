import * as t from 'io-ts';
import { buildValidator } from "@twoupdigital/mobx-utils/libjs/buildValidator";
import { buildModelValidator, buildApiItemDefault, buildApiItemSimple, buildArrayDecoderModel } from 'src/api/utils/modelUtils';
import {
    decodeNumberOrUndefined,
    decodeStringOrUndefined,
    decodeArrayNumberOrNull,
    buildOptionalDecoderModel,
    decodeString,
    decodeNumber,
    decodeBoolean,
    decodeNumberOrNull,
} from 'src/api/utils/commonModelValidators';


const decodeBonus = buildModelValidator('bonus', {
    type: buildApiItemDefault(decodeStringOrUndefined, ''),
    id: buildApiItemDefault(decodeNumber, 0),
    amount: buildApiItemDefault(decodeNumber, 0)
});

const decodeFreebet = buildModelValidator('freebet', {
    id: buildApiItemSimple(decodeNumberOrUndefined),
    amount: buildApiItemSimple(decodeNumberOrUndefined)
});

const decodeTags = buildModelValidator('tags', {
    bonuses: buildApiItemSimple(buildArrayDecoderModel(decodeBonus)),
    freebetCredits: buildApiItemSimple(buildArrayDecoderModel(decodeFreebet)),
    selections: buildApiItemSimple(decodeArrayNumberOrNull),
});

const decodeTransaction = buildModelValidator('transaction', {
    tags: buildApiItemSimple(buildOptionalDecoderModel(decodeTags)),
    updatedAt: buildApiItemDefault(decodeString, ''),
    wallet: buildApiItemDefault(buildValidator('', t.unknown), {})
});

const decodeSport = buildModelValidator('sport', {
    id: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeCompetition = buildModelValidator('competition', {
    id: buildApiItemDefault(decodeString, ''),
    name: buildApiItemDefault(decodeString, ''),
});

const decodeEvent = buildModelValidator('event', {
    id: buildApiItemDefault(decodeStringOrUndefined, ''),
    eventId: buildApiItemDefault(decodeNumberOrUndefined, null),
    name: buildApiItemDefault(decodeString, ''),
    url: buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeMarket = buildModelValidator('market', {
    id: buildApiItemDefault(decodeNumberOrUndefined, 0),
    name: buildApiItemDefault(decodeStringOrUndefined, ''),
    url: buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeSelection = buildModelValidator('selection', {
    id: buildApiItemDefault(decodeNumberOrUndefined, 0),
    name: buildApiItemDefault(decodeString, ''),
});

const decodePrice = buildModelValidator('price', {
    d: buildApiItemDefault(decodeNumberOrUndefined, 0),
    f: buildApiItemDefault(decodeStringOrUndefined, ''),
});

const decodeSPprice = buildModelValidator('SPprice', {
    d: buildApiItemDefault(decodeNumber, 0),
    f: buildApiItemDefault(decodeString, ''),
});

const decodeBetLegResult = buildModelValidator('betLegResult', {
    place: buildApiItemDefault(decodeNumberOrUndefined, 0),
    type: buildApiItemDefault(decodeString, ''),
    r4Deductions: buildApiItemDefault(decodeNumberOrUndefined, 0)
});

const decodeReduction = buildValidator('', t.interface({
      num: t.number,
      den: t.number
    })
);

const decodeEachWayTerms = buildModelValidator('eachWayTerms', {
    places: buildApiItemDefault(decodeNumber, 0),
    reduction: buildApiItemDefault(decodeReduction, null)
});

const decodeRabSelections = buildModelValidator('RabSelection', {
    market: buildApiItemSimple(buildModelValidator('market', {
        name: buildApiItemDefault(decodeString, ''),
    })),
    selection: buildApiItemSimple(buildModelValidator('selection', {
        name: buildApiItemDefault(decodeString, ''),
    })),
});

const decodeBetLeg = buildModelValidator('betLeg', {
    competition: buildApiItemSimple(buildOptionalDecoderModel(decodeCompetition)),
    eachWayTerms: buildApiItemSimple(buildOptionalDecoderModel(decodeEachWayTerms)),
    event: buildApiItemSimple(decodeEvent),
    id: buildApiItemDefault(decodeString, ''),
    inPlay: buildApiItemDefault(decodeBoolean, false),
    placeReduction: buildApiItemDefault(buildValidator('', t.unknown), {}),
    price: buildApiItemSimple(
        buildOptionalDecoderModel(decodePrice)
    ),
    priceType: buildApiItemDefault(decodeString, ''),
    result: buildApiItemSimple(buildOptionalDecoderModel(decodeBetLegResult)),

    //for normal bet
    market: buildApiItemSimple(buildOptionalDecoderModel(decodeMarket)),
    selection: buildApiItemSimple(buildOptionalDecoderModel(decodeSelection)),

    //for rab
    selections: buildApiItemSimple(buildOptionalDecoderModel(buildArrayDecoderModel(decodeRabSelections))),

    spPrice: buildApiItemSimple(buildOptionalDecoderModel(decodeSPprice)),
    sport: buildApiItemSimple(buildOptionalDecoderModel(decodeSport)),
    type: buildApiItemDefault(decodeString, ''),
});

const decodeAccount = buildModelValidator('account', {
    id: buildApiItemDefault(decodeNumber, 0),
    name: buildApiItemDefault(decodeString, ''),
    type: buildApiItemDefault(decodeString, ''),
});

const decodeResults = buildModelValidator('results', {
    account: buildApiItemSimple(decodeAccount),
    id: buildApiItemDefault(decodeNumber, 0),
    type: buildApiItemDefault(decodeString, ''),
    cashOut: buildApiItemDefault(decodeBoolean, false),
    comment: buildApiItemDefault(decodeStringOrUndefined, ''),
    eachWay: buildApiItemDefault(decodeBoolean, false),
    currency: buildApiItemDefault(decodeString, ''),
    stakePerLine: buildApiItemDefault(decodeNumber, 0),
    operatorStakePerLine: buildApiItemDefault(decodeNumber, 0),
    numLines: buildApiItemDefault(decodeNumber, 0),
    payout: buildApiItemDefault(decodeNumberOrUndefined, 0),
    totalStake: buildApiItemDefault(decodeNumber, 0),
    operatorTotalStake: buildApiItemDefault(decodeNumber, 0),
    status: buildApiItemDefault(decodeString, ''),
    placedAt: buildApiItemDefault(decodeString, ''),
    tax: buildApiItemDefault(decodeNumberOrNull, null),
    ip: buildApiItemDefault(decodeStringOrUndefined, ''),
    channel: buildApiItemDefault(decodeString, ''),
    stakeFactor: buildApiItemDefault(decodeNumber, 0),
    potentialReturns: buildApiItemDefault(decodeNumberOrUndefined, 0),
    maxBet: buildApiItemDefault(decodeNumberOrUndefined, undefined),
    legs: buildApiItemDefault(buildArrayDecoderModel(decodeBetLeg), []),
    transaction: buildApiItemSimple(decodeTransaction),
});

const decodeResultsArray = buildArrayDecoderModel(decodeResults);

const decodeAggregations = buildModelValidator('aggregations', {
    noOfBets: buildApiItemDefault(decodeNumber, 0),
});

const modelConfig = {
    results: buildApiItemSimple(decodeResultsArray),
    aggregations: buildApiItemSimple(buildOptionalDecoderModel(decodeAggregations)),
    operatorCurrency: buildApiItemDefault(decodeString, 'GBP'),
};

export type BonusTypes = ReturnType<typeof decodeBonus>;

export type BetLegModelType = ReturnType<typeof decodeBetLeg>;
const decodeBetLegs = buildArrayDecoderModel(decodeBetLeg);
export type BetLegsModelType = ReturnType<typeof decodeBetLegs>;

export type AllBetsResultsModelType = ReturnType<typeof decodeResultsArray>;
export type SingleBetResultModelType = ReturnType<typeof decodeResults>;

export const decodeAccountAllBetsDataModel = buildModelValidator('AccountAllBetsData', modelConfig);
export type AccountAllBetsDataModelType = ReturnType<typeof decodeAccountAllBetsDataModel>;



export type BetsFreeBetsType = ReturnType<typeof decodeFreebet>;
export type BetsBonusesType = ReturnType<typeof decodeBonus>;