import { logNormalizePath } from './logNormalizePath';

describe('logNormalizePath', () => {
    it('basic use', () => {

        expect(logNormalizePath('/accounts/star/customer/127')).toBe('/accounts/:universe/:role/:number');
        expect(logNormalizePath('/accounts/star/staff/127')).toBe('/accounts/:universe/:role/:number');
        expect(logNormalizePath('/accounts/star/program/127')).toBe('/accounts/:universe/:role/:number');
        expect(logNormalizePath('/accounts/star/anonymous/127')).toBe('/accounts/:universe/:role/:number');

        expect(logNormalizePath('/sessions/star/customer/63d09b7d-6f04-11eb-a083-5057d25f6201'))
            .toBe('/sessions/:universe/:role/:uuid');
        
        expect(logNormalizePath('/star/pragmatic-casino/casino/games/launch/'))
            .toBe('/:universe/pragmatic-casino/casino/games/launch');
    });
});
