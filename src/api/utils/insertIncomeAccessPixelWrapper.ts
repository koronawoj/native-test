//@ts-nocheck
import { insertIncomeAccessPixel } from 'src/config/config';

export function insertIncomeAccessPixelWrapper(insertIncomeAccessPixel: boolean, accountId: number, type: 'login' | 'registration'): unknown {
    if (insertIncomeAccessPixel) {
        insertIncomeAccessPixel(accountId);
    }

    // tslint:disable-next-line
    if (window !== undefined) {
        /* eslint-disable-next-line */
        if (window.IGLOO && typeof window.IGLOO.getBlackbox === 'function') {
            /* eslint-disable-next-line */
            const { blackbox } = window.IGLOO.getBlackbox();
            return $appState.apiWrapper.api.post('/iovation', { id: accountId, blackbox, type });

            //TODO - remove frontend-api handler and replace with new mechani
            // ---> /api/iovation
        }
    }
}
