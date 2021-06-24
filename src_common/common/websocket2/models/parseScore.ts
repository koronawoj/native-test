/*
Do not delete this comment

Football

        "statistics": {
            "woodworks": {
                "home": 0,
                "away": 0
            },
            "score": {
                "home": 1,
                "away": 1
            },
            "red-cards": {
                "home": 0,
                "away": 0
            },
            "yellow-cards": {
                "home": 1,
                "away": 2
            },
            "substitution": {
                "home": 0,
                "away": 0
            }
        },

Tennis
        "statistics": {
            "match-status": {
                "value": "6-7 6-2 0-0"
            },
            "set": {
                "value": 3
            }
        },
*/

const parseIntValue = (valueRaw: string): number | undefined => {
    const value = parseInt(valueRaw, 10);

    if (isNaN(value)) {
        return undefined;
    }

    return value;
};

export interface SingleScoreType {
    home: number,
    away: number,
}

const parseScorePair = (home: string | undefined | null, away: string | undefined | null): SingleScoreType | null => {
    const homeInput = home ?? null;
    const awayInput = away ?? null;

    if (homeInput !== null && awayInput !== null) {
        const home = parseIntValue(homeInput);
        const away = parseIntValue(awayInput);

        if (home !== undefined && away !== undefined) {
            return {
                home,
                away
            };
        } else {
            console.error('Problem with score parsing', { home, away });
        }
    }

    return null;
};

//TODO - to restore ...
// Now we don't receive statistics for Tennis from LSport
// const parseSetValue = (statistics: Record<string, undefined | Record<string, undefined | string>>): number | undefined => {
//     const setRaw: string | undefined = statistics.set?.value;

//     if (setRaw === undefined) {
//         return undefined;
//     }

//     return parseIntValue(setRaw);
// };

// const parseMatchStatus = (tennisScore: string): Array<SingleScoreType> => {
//     const out: Array<SingleScoreType> = [];

//     for (const el of tennisScore.split(' ')) {
//         const scoreArray = el.split('-');

//         const itemHome = scoreArray[0];
//         const itemAway = scoreArray[0];

//         if (itemHome !== undefined && itemAway !== undefined) {
//             const home = parseIntValue(itemHome);
//             const away = parseIntValue(itemAway);
            
//             //return { home: parseInt(scoreArray[0]), away: parseInt(scoreArray[1]) };
//             if (home !== undefined && away !== undefined) {
//                 out.push({ home, away });
//             }
//         }
//     }

//     return out;
// };

// type ParseScoreResultType = {
//     // formatted: string;
//     value: SingleScoreType[];
//     //set: string | undefined;
// } | {
//     // formatted: string;
//     value: {
//         home: string;
//         away: string;
//     }[];
//     //set?: undefined;
// };

export const parseScore = (statistics: Record<string, undefined | Record<string, undefined | string>>): SingleScoreType[] => {
    // Now we don't receive statistics for tennis form LSport
    // const tennisScore: string | undefined = statistics['match-status']?.value;

    // if (tennisScore !== undefined) {
    //     //const set: number | undefined = parseSetValue(statistics);

    //     let homeSets = 0;
    //     let awaySets = 0;

    //     const value = parseMatchStatus(tennisScore);

    //     value.forEach((accumulator, index) => {
    //         if (set !== undefined && index + 1 < set) {
    //             if (accumulator.home > accumulator.away) {
    //                 homeSets++;
    //             } else {
    //                 awaySets++;
    //             }
    //         }
    //     });

    //     const getValue = (): Array<SingleScoreType> => {
    //         const lastSet = value.pop();

    //         if (lastSet === undefined) {
    //             return [{ home: homeSets, away: awaySets }];
    //         } else {
    //             return [{ home: homeSets, away: awaySets }, lastSet];
    //         }
    //     };

    //     return getValue();
    // }

    // handle other sports
    const home = statistics.score?.home;
    const away = statistics.score?.away;

    const score = parseScorePair(home, away);

    if (score !== null) {
        return [score];
    }

    // if (home !== undefined && away !== undefined) {
    //     return {
    //         value: [{ home, away }]
    //     };
    // }

    return [];
};
