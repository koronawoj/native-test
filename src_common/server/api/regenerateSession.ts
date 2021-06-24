import * as t from 'io-ts';
import { UniverseType } from 'src_common/common/universe';
import { createGuard } from 'src_common/common/createGuard';
import { fetchGeneral } from 'src_common/common/fetch';

const ResponseIO = t.interface({
    access_token: t.string,
});

const isResponse = createGuard(ResponseIO);

export const regenerateSession = async (
    API_URL: string,
    API_TIMEOUT: number,
    API_UNIVERSE: UniverseType,
    accountType: string,
    jwtToken: string,
): Promise<string | null> => {
    
    const response = await fetchGeneral('POST', {
        url: `${API_URL}/sessions/${API_UNIVERSE}/${accountType}`,
        backendToken: jwtToken,
        body: {
            'grant_type': 'refresh_token',
            'refresh_token': jwtToken
        },
        timeout: API_TIMEOUT,
    });

    if (response.status === 201 && response.body.type === 'json' && isResponse(response.body.json)) {
        return response.body.json.access_token;
    }

    console.error('Errors when regenerate an session', response);

    return null;
};
