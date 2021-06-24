import * as t from 'io-ts';
import { buildValidator } from '@twoupdigital/mobx-utils/libjs/buildValidator';

export const RabMarketSelectionTypeIO = t.partial({
    id: t.string,
    name: t.string,
    team: t.string,
    away: t.number,
    home: t.number,
    ou: t.string,
    yn: t.string,
    oy: t.string,
    value: t.string,
});

const RabMarketSelectionIO = t.interface({
    name:  t.string,
    selectionType: RabMarketSelectionTypeIO,
});

const RabMarketViewDetailsIO = t.interface({
    displayOrder:  t.number,
    selectionDisplayType: t.union([t.literal('Column'), t.literal('Row'),  t.literal('TwoColumns'), t.literal('ThreeColumns'), t.literal('CorrectScore')]),
    active: t.boolean,
});

export type RabMarketSelectionType = t.TypeOf<typeof RabMarketSelectionIO>;

const StringOptionalIO = t.union([t.string, t.undefined, t.null]);

const NumberOptionalIO = t.union([t.number, t.undefined, t.null]);

export const RabMarketIO = t.interface({
    marketType: t.string,
    name: t.string,
    bettable: t.string,
    period: t.string,
    scorerOrder: StringOptionalIO,
    margin: NumberOptionalIO,
    handicap: NumberOptionalIO,
    yesName: StringOptionalIO,
    noName: StringOptionalIO,
    line: NumberOptionalIO,
    team: StringOptionalIO,
    selections: t.array(RabMarketSelectionIO),
    match1Name: StringOptionalIO,
    match2Name: StringOptionalIO,
    otherName: StringOptionalIO,
    marketTemplateType: t.string,
    viewDetails: RabMarketViewDetailsIO
});

export const decodeArrayRabMarket = buildValidator('ArrayRabMarket', t.array(RabMarketIO));

export type RabMarketType = t.TypeOf<typeof RabMarketIO>
