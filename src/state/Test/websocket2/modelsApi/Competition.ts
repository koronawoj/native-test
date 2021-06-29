import * as t from 'io-ts';
import { buildValidator } from '../../utils/buildValidator';

const CompetitionModelIO = t.interface({
    id: t.number,
    name: t.string,
    displayOrder: t.number,
    updatedAt: t.string
});

export type CompetitionModelType = t.TypeOf<typeof CompetitionModelIO>;

export const decodeCompetitionModel = buildValidator('CompetitionModel', CompetitionModelIO);
