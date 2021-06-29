import { fetchPost } from 'src/state/Test/utils/fetch';
import { LegType, CastBetType } from 'src/state/Test/betSlipState/BetSlipTypes';
import { decodePostPlaceBetResponse, BettingPlaceBetType } from './postPlaceBetTypes';

export interface PlaceBetRequestType {
    legs: Array<LegType>,
    combinations: Array<CastBetType>,
    rabBets: Array<RabBetType> | null,
    channel: string,
    isFreeBet: boolean,
    isFreeBetTax: boolean,
}

export interface RabBetType {
    type: string;
    stakePerLine: number | undefined;
    payout: number | undefined | null;
    eachWay: boolean;
    channel: string;
    platformId: string | null | undefined;
    correlationId: string,
    freebetCredits: Array<{
        id: number,
        amount: number
    }>,
    freebetRemarks: Array<{
        resource: string,
        code: string,
        details: {
            minimum: number
        }
    }>,
    legs: Array< {
        type: string | undefined;
        priceType: string,
        channel: string,
        sport: {
            id: string;
        };
        event: {
            id: number;
            externalId: string;
        };
        selections: Array<any>;
        price: {
           d: number,
           f: string
        };
    }>
}


export const postPlaceBet = async ({ legs, combinations, channel, isFreeBet, isFreeBetTax, rabBets }: PlaceBetRequestType): Promise<BettingPlaceBetType> => {
    const response = await fetchPost({
        url: `/api/betslip/place-bet-from-website`,
        decode: decodePostPlaceBetResponse,
        body: { legs, combinations, channel, isFreeBet, isFreeBetTax, rabBets }
    });
    if (response.status === 200) {

        return {
            status: 'success',
            data: response.bodyJson

        };
    };


    if (response.status === 400) {
        const { data, debug } = response.bodyJson;

        return {
            status: 'error',
            data: data,
            debug: debug

        };
    }

    return null;
};
