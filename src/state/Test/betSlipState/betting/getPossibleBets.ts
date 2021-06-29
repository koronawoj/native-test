import { fetchPost } from 'src/state/Test/utils/fetch';
import { convertBets } from './parse';
import { decodeResponseGetPossibleBets, BettingPossibleBetsType, GetPossibleBetsRequestType, decodeRawResponseGetPossibleBets, GetPossibleBetsRequestNewType, decodeRequestBody } from './getPossibleBetsTypes';
import { PromiseBox } from 'src/state/Test/utils/PromiseBox';

export const getPossibleBets = async ({ legs, combinations, channel, isFreeBet, isFreeBetTax, rabBets }: GetPossibleBetsRequestType): Promise<BettingPossibleBetsType> => {
    const response = await fetchPost({
        url: '/api/betslip/possible-bets',
        decode: decodeRawResponseGetPossibleBets,
        body: {
            legs,
            combinations,
            channel,
            isFreeBet,
            isFreeBetTax
        }
    });

    if (response.status === 200) {
        const { bets, combinations, errors } = response.bodyJson;
        const parsedResponse = convertBets(bets, combinations, rabBets, errors);

        const decodedResponse = decodeResponseGetPossibleBets(parsedResponse);
        if (decodedResponse instanceof Error) {

            return null;
        }

        return {
            status: 'success',
            data: decodedResponse
        };
    }

    return null;
};

let cancelBox: PromiseBox<void> | null = null;
    
//eslint-disable-next-line
const makeRequest = async (params: GetPossibleBetsRequestNewType) => {
    try {
        const { channel, isFreeBet, isFreeBetTax, accountData, bets, legCombinations, rabBets } = params;


        if(cancelBox !== null) {
            cancelBox.resolve();
        }
        cancelBox = new PromiseBox();

        return await fetchPost({
            url: '/api-web/post-possible-bets',
            decode: decodeRawResponseGetPossibleBets,
            body: {
                channel,
                isFreeBet,
                isFreeBetTax,
                accountData,
                bets,
                legCombinations,
                rabBets
            },
            cancel: cancelBox.promise
        });
    } catch(error) {
        const errorCanceled = error.message ?? null;
        if(errorCanceled === null) {
            console.log('Canceled error');
            return null;
        }

        throw error;
    }
};

export const getPossibleBetsNew = async (params: GetPossibleBetsRequestNewType): Promise<BettingPossibleBetsType> => {

    const { channel, isFreeBet, isFreeBetTax, accountData, bets, legCombinations, rabBets } = params;


    const decodedBodyRequest = decodeRequestBody({ channel, isFreeBet, isFreeBetTax, accountData, bets, legCombinations, rabBets });
    if (decodedBodyRequest instanceof Error) {
        console.log('decodedBodyRequest',decodedBodyRequest);
        console.error(decodedBodyRequest);
        return null;
    }

    const response = await makeRequest(params);
    
    if (response === null) {
        return null;
    }

    if(response.status === 500) {
        return {
            status: 'error',
            data: {
                message: 'Server error',
            }
        };
    }

    if (response.status === 200 || response.status === 400) {
        const { bets, combinations, errors, rabBets } = response.bodyJson;
        const parsedResponse = convertBets(bets, combinations, rabBets,  errors);
        const decodedResponse = decodeResponseGetPossibleBets(parsedResponse);
        if (decodedResponse instanceof Error) {
            console.log('parsedResponse',parsedResponse);
            console.error(decodedResponse);
            return null;
        }

        return {
            status: 'success',
            data: decodedResponse
        };
    }

    return null;
};
