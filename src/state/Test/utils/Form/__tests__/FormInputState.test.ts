import { input } from '../index';

describe('FormInputState', () => {
    it('modifiedStatus', () => {
        const formInput = input('', false);

        expect(formInput.modifiedStatus).toEqual(false);
        formInput.setValue('asadas');
        expect(formInput.modifiedStatus).toEqual(true);
        formInput.setValue('');
        expect(formInput.modifiedStatus).toEqual(false);
        formInput.setValue('asadas');
        expect(formInput.modifiedStatus).toEqual(true);

        formInput.setAsVisited();

        expect(formInput.isVisited).toEqual(true);

        formInput.reset();
        expect(formInput.modifiedStatus).toEqual(false);
        expect(formInput.isVisited).toEqual(false);
    });
});
