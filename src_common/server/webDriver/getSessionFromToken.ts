import jwt from 'jsonwebtoken';
import * as t from 'io-ts';
import { createGuard } from 'src_common/common/createGuard';

const parseNumber = (value: string): number | null => {
    const valueNumber = parseInt(value, 10);

    if (isNaN(valueNumber)) {
        return null;
    }

    return valueNumber;
};

const JwtDataIO = t.interface({
    sub: t.string,      //userId
    sid: t.string,      //sessionID in CouchBase,
    st: t.string,
});

const isJwtData = createGuard(JwtDataIO);

export interface SessionType {
    userId: number | null,
    sessionIdDB: string,
    accountType: string,
}

export const getSessionFromToken = (jwtToken: string): null | SessionType => {
    const data = jwt.decode(jwtToken);

    if (!isJwtData(data)) {
        console.error('Incorrect data in token', data);
        return null;
    }

    return {
        userId: parseNumber(data.sub),
        sessionIdDB: data.sid,
        accountType: data.st,
    };
};
