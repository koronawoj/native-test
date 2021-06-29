import { ParsedLegsType, ParsedPossibleBetsType, ParsedCombinationsType, CombinationRawType, ErrorRawType, BetResponseType, RabRawType } from "./getPossibleBetsTypes";
import { ReferralParsedLegsType } from 'src/state/Test/betSlipState/betting/getReferredTypes';

export const onCheckIsRelated = (combinations: Record<string, ParsedCombinationsType>):boolean => {
    return Object.values(combinations).some(combination => {
        if(combination.errors !== undefined) {
            return combination.errors.some(err => err.resource === 'Selection' && err.code === 'related');
        }
        return false;
    });
};

export const onCheckIsSinglesOnly = (combinations: Record<string, ParsedCombinationsType>):boolean => {
    return Object.values(combinations).some(combination => {
        if(combination.errors !== undefined) {
            return combination.errors.some(err => err.resource === 'Market' && err.code === 'singles-only');
        }
        return false;
    });
};

export function convertBetsToLegs(bets:Array<BetResponseType>/*, combinations: Record<string, ParsedCombinationsType>*/): Record<string, ParsedLegsType> {
    const result: Record<string, ParsedLegsType> = {};

    for (const bet of bets) {
        if (bet.id.substr(0, 3) === 'all') {
            continue;
        }

        const firstLeg = bet.legs[0];
        if(firstLeg !== undefined && firstLeg.selection !== undefined) {
            result[firstLeg.selection.id] = {
                eachWay: bet.eachWay,
                potentialReturns: bet.potentialReturns ?? null,
                potentialReturnsAt: bet.stakePerLine,
                freebetCredits: bet.freebetCredits,
                freebetRemarks: bet.freebetRemarks,
                maxStake: bet.maxStake ?? null,
                price: bet.type === 'SGL' && bet.legs.length === 1 && firstLeg.price !== undefined ? firstLeg.price : bet.price,
                errors: bet.errors,
            };
        }
    }

    return result;
}

export function convertBetsToCombinations(bets: Record<string, CombinationRawType>, legs: Array<BetResponseType>): Record<string, ParsedCombinationsType> {
    const result: Record<string, ParsedCombinationsType> = {};

    for (const bet of Object.values(bets)) {
        const betFromLegs = legs.find(leg => leg.type === bet.type);

        if (bet.type === 'SGL') {
            continue;
        }

        const errors = betFromLegs !== undefined ? betFromLegs.errors : bet.errors;

        result[bet.type] = {
            type: bet.type,
            ewOffered: bet.ewOffered,
            name: bet.name,
            potentialReturns: bet.potentialReturns ?? null,
            potentialReturnsEw: bet.potentialReturnsEw ?? null,
            freebetCredits: bet.freebetCredits ?? undefined,
            freebetRemarks: bet.freebetRemarks ?? undefined,
            maxStake: bet.maxStake ?? undefined,
            potentialReturnsAt: bet.stakePerLine,
            numLines: bet.numLines,
            price: bet.price ?? undefined,
            errors: errors ?? undefined,
            legs: bet.legs ?? []
        };
    }

    return result;
}

export const onCheckIsRelatedOnAdd = (combinations: Record<string, ParsedCombinationsType>): boolean => {
    let relatedOnAdd = false;
    for (const bet of Object.values(combinations)) {
        if(!relatedOnAdd) {
            const betMarketsIds: Array<number> = [];

            if(bet.legs.length > 0) {
                if (bet.type === 'SGL') {
                    continue;
                }

                for(const leg of bet.legs) {
                    if(leg.market !== undefined) {
                        if(!betMarketsIds.includes(leg.market.id)) {
                            betMarketsIds.push(leg.market.id);
                        } else {
                            relatedOnAdd = true;
                        }
                    }
                }
            }

        }
    }
    return relatedOnAdd;
};

export function convertBets(bets:Array<BetResponseType>, combinations: Record<string, CombinationRawType>, rabBets: Array<RabRawType>, errors: Array<ErrorRawType>): ParsedPossibleBetsType {
    for (const bet of bets) {
        const combination = combinations[bet.type];

        if (bet.legs.length > 1 && combination !== undefined) {
            combination.stakePerLine = bet.stakePerLine;
            combination.price = bet.price;
            combination.freebetCredits = bet.freebetCredits;
            combination.freebetRemarks = bet.freebetRemarks;
            combination.maxStake = bet.maxStake;
        }
    }

    const convertedCombinations = convertBetsToCombinations(combinations, bets);
    const relatedOnAdd = onCheckIsRelatedOnAdd(convertedCombinations);
    const convertedLegs = convertBetsToLegs(bets);//, convertedCombinations);
    const isRelated = onCheckIsRelated(convertedCombinations);// Object.values(convertedLegs).some(leg => leg.related);
    const isSinglesOnly = onCheckIsSinglesOnly(convertedCombinations); //Object.values(convertedLegs).some(leg => leg['singles-only']);


    let singleError: ErrorRawType | null = null;

    for(const err of errors) {
        if(err.field === 'playableBalance' && err.code === 'minimum' && err.resource === 'Wallet') {
            singleError = err;
            break;
        }
    }

    return {
        combinations: convertedCombinations,
        legs: convertedLegs,
        rabBets,
        related: isRelated,
        singlesOnly: isSinglesOnly,
        playableBalanceAmounts: singleError !== null ? singleError.details : null,
        bets,
        relatedOnAdd,
        errors,
    };
}

const parseLeg = (leg: any): ReferralParsedLegsType => {
    let id: number | null = null;
    const selectionId = leg.selectionId ?? null;
    const eventId = leg.eventId ?? null;
    const marketId = leg.marketId ?? null;
    const selection = leg.selection;
    const event = leg.event;
    const market = leg.market;

    const legInner: ReferralParsedLegsType = {
        type: leg.type,
        price: leg.price,
        priceType: leg.priceType,
        index: '-',
        stakePerLine: 0,
        eachWay: false,
        empty: false,
        selectionName: undefined,
        eventName: undefined,
        id: null,
        eventId: null,
        marketId: null,
        selectionId: null,
        potentialReturns: null,
    };
 

    if (selectionId === null) {
        legInner.empty = true;
        legInner.selectionName = leg.selection.name ?? undefined;
        legInner.eventName = leg.event.name ?? undefined;
    } else {
        id = selectionId ?? selection.id;

        legInner.eventId = eventId ?? event.id;
        legInner.marketId = marketId ?? market.id;
        legInner.selectionId = selectionId ?? selection.id;
    }

    legInner.id = id;
    legInner.eventId = eventId;
    legInner.marketId = marketId;
    legInner.selectionId = selectionId;

    return legInner;
};

export const mapOfferBets = (bets: Array<any>, expiresAt: string | null | undefined, type: string): unknown => {
    const combinations: Record<string, any> = {};
    const legs: Record<string, ReferralParsedLegsType> = {};
    let channel;
    let emptyBetId = 0;

    for (const bet of bets) {
        if (bet.type === 'SGL' && bet.legs.length === 1) {
            const firstLeg = bet.legs[0] ?? null;
            const leg = firstLeg !== null ? parseLeg(firstLeg) : null;
            let id = leg !== null ? leg.id : null;

            if(leg !== null && id !== null) {
                const singleLeg = legs[id.toString()] ?? null;
    
                if (leg.empty !== undefined) {
                    emptyBetId++;
                    id = `empty${emptyBetId}`;
                } else if (singleLeg !== null) {
                    const tempId = `${id}${Object.keys(legs).length}`;
    
                    id = parseInt(tempId, 10);
                }

                legs[id] = leg;
                leg.index = id;
                leg.stakePerLine = bet.stakePerLine;
                leg.eachWay = bet.eachWay;
                leg.potentialReturns = bet.potentialReturns;
            }
        } else {
            // @TODO: Think about multiple combinations of same type
            // @TODO: Think about combinations of part legs

            combinations[bet.type] = bet;

            for (const legInner of bet.legs) {
                const leg = parseLeg(legInner);
                let id = leg.id;
                if(id !== null) {
                    const singleLeg = legs[id.toString()] ?? null;
    
                    if (leg.empty !== undefined) {
                        emptyBetId++;
                        id = `empty${emptyBetId}`;
                    } else if (singleLeg !== null) {
                        continue;
                    }
    
                    legs[id] = leg;
    
                    leg.index = id;
                    leg.stakePerLine = 0;
                    leg.eachWay = false;
                }
            }
        }
        channel = bet.channel;
    }

    return { combinations, legs, channel, expiresAt, type };
};