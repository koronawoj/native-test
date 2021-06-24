import * as t from 'io-ts';
import { UniverseType } from 'src_common/common/universe';
import { createGuard } from 'src_common/common/createGuard';
import { fetchGeneral } from 'src_common/common/fetch';

const ResponseIO = t.interface({
    access_token: t.string,
});

const isResponse = createGuard(ResponseIO);

export const createAnonymousSession = async (
    API_URL: string,
    API_TIMEOUT: number,
    API_UNIVERSE: UniverseType
): Promise<string | null> => {
    const response = await fetchGeneral('POST', {
        url: `${API_URL}/sessions/${API_UNIVERSE}/anonymous`,
        body: {
            'username':'anonymous',
            'password':'anonymous',
            'grant_type':'password'
        },
        timeout: API_TIMEOUT,
    });

    if (response.status === 201 && response.body.type === 'json' && isResponse(response.body.json)) {
        return response.body.json.access_token;
    }

    console.error('Errors when creating an anonymous session', response);

    return null;
};
