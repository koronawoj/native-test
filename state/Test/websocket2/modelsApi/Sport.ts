import * as t from 'io-ts';
import { buildValidator } from '../../utils/buildValidator';

const SportIO = t.interface({
    id: t.string,
    name: t.string,
    displayOrder: t.number
});

export type SportModelType = t.TypeOf<typeof SportIO>;

export const decodeSportModelFromSocket = buildValidator('API - sportModel from socket', SportIO, true);
