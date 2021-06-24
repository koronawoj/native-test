import queryString from 'query-string';
import { ParamsFetchType, MethodType, GenerateUrlApiType, ResponseType } from 'src_common/browser/apiUtils';
import { GenerateUrlApiParamsType } from 'src_common/server/webDriver/sdkApiWebUtils';
import { decodeString } from 'src/api/utils/commonModelValidators';
import { buildApiItemDefault, buildModelValidator } from 'src/api/utils/modelUtils';

const decodeCasinoGameDetailsModel = buildModelValidator('Casino GameDetails', {
    href: buildApiItemDefault(decodeString, ''),
    //sessionId: buildApiItemDefault(decodeString, ''),
});

export type CasinoGameDetailsModelType = {
    type: 'game_details',
    href: string,
} | {
    type: 'unavailable_forLegal_reasons',
} | {
    type: 'access_error',
    message: string,
};

const decode = (status: number, data: ResponseType): CasinoGameDetailsModelType => {
    if (status === 403) {
        throw Error('User must be logged in to use this method');
    }

    if (status === 200 && data.type === 'json') {
        const dataDecoded = decodeCasinoGameDetailsModel(data.json);

        return {
            type: 'game_details',
            href: dataDecoded.href,
        };
    }

    if (status === 451) {
        return {
            type: 'unavailable_forLegal_reasons',
        };
    }

    throw new Error(`unhandled response ${status} - ${data.type}`);
};

interface ParamsType {
    gameId: number,
    mode: 'demo' | 'real',
    clientType: 'mobile' | 'desktop',               //In website is use always as mobile
}

export const casinoGetGameDetails = {
    browser: {
        params: (params: ParamsType): ParamsFetchType<ParamsType> => {
            // return {
            //     type: MethodType.POST,
            //     url: `/api-web/casino/get-game-details`,
            //     body: params
            // };

            /*
                There are problems with getting rid of this method from frontend-api
            */

            //https://starsports.bet/api/casino/game/182041?clientType=mobile&mode=real
            //https://starsports.bet/api/casino/game/182041?clientType=mobile&mode=real
            const query = queryString.stringify({
                clientType: params.clientType,
                mode: params.mode
            });

            return {
                type: MethodType.GET,
                url: `/api/casino/game/${params.gameId}?${query}`,
            };
        },
        decode
    },
    express: {
        method: MethodType.POST,
        urlBrowser: '/api-web/casino/get-game-details',
    },
    generateUrlApi: async (params: GenerateUrlApiParamsType<ParamsType>): Promise<GenerateUrlApiType> => {
        const userId = params.userSessionId;

        if (userId === null) {
            return {
                passToBackend: false,
                status: 403,
                responseBody: {
                    'message': 'User must be logged in to use this method',
                }
            };
        }
    
        const gameId = params.req.body.gameId;
        const mode = params.req.body.mode;
        const clientType = params.req.body.clientType;

        const paramsRequest = {
            gameId: gameId,                             //req.params.id,
            lang: 'en_US',
            mode: mode,                                 //mode || 'demo',
            clientType: clientType,                     //clientType || 'desktop'
            //lobby: `https://${params.req.hostname}`     //req.headers.host
        };
        const query = queryString.stringify(paramsRequest);

        return {
            url: `${params.API_URL}/casino-api/${params.API_UNIVERSE}/nyx/game-url?${query}`,
            passToBackend: true,
            method: MethodType.GET
        };
    }
};


/*
https://starsports.bet/api/casino/game/182041?clientType=mobile&mode=real
https://starsports.bet/api/casino/game/182041?clientType=mobile&mode=real

/casino-api/{universe}/nyx/game-url {
  lobby: 'https://127.0.0.1:3030',
  gameId: '182015',
  lang: 'en_US',
  mode: 'real',
  clientType: 'mobile'
}

$appState.apiCommon.casinoGetGameDetails.run({
  gameId: 500263,
  mode: 'real',
  clientType: 'mobile'
}).then((resp) => {
  console.info('finalna odpowiedz', resp);
});



{
    "type":"json",
    "json":{
        "origin":"https://1x2uk.com",
        "pathName":"/NYX/loadMobileGameGibStaging.jsp",
        "searchParameters":{
            "envid":"eur",
            "stage":"1",
            "gameid":"2025",
            "operatorid":"950",
            "sessionid":"138040-35222000-077c-11eb-ae95-5057d25f6201",
            "currency":"EUR",
            "lang":"en",
            "lobbyurl":"https://127.0.0.1/casino",
            "mode":"real",
            "device":"mobile",
            "jurisdiction":"uk",
            "realitycheck_uk_elapsed":"238",
            "realitycheck_uk_limit":"1800",
            "realitycheck_uk_proceed":"https://127.0.0.1/api/casino/game/proceed/138040-35222000-077c-11eb-ae95-5057d25f6201",
            "realitycheck_uk_history":"https://127.0.0.1/casino?account=transaction-history",
            "gpid":"106",
            "ogsenv":"gibraltarstage"
        }
    }
}

href: "https://ogs-gl-stage.nyxgib.eu/game/?nogsgameid=182015&nogsoperatorid=950&nogsmode=real&nogslang=en_US&nogscurrency=EUR&clienttype=mobile&sessionid=138040-35222000-077c-11eb-ae95-5057d25f6201&accountid=138040&jurisdiction=uk&realitycheck_uk_elapsed=470&realitycheck_uk_limit=1800&realitycheck_uk_history=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino%3Faccount%3Dtransaction-history&lobbyurl=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino&depositurl=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino%3Faccount%3Dtop-up&realitycheck_uk_proceed=https%3A%2F%2F127.0.0.1%3A3030%2Fapi%2Fcasino%2Fgame%2Fproceed%2F138040-35222000-077c-11eb-ae95-5057d25f6201"
sessionId: "138040-35222000-077c-11eb-ae95-5057d25f6201"


The request should be repeated with <a href="https://ogs-gl-stage.nyxgib.eu/game/?nogsgameid=182015&nogsoperatorid=950&nogsmode=real&nogslang=en_US&nogscurrency=EUR&clienttype=mobile&sessionid=138040-35222000-077c-11eb-ae95-5057d25f6201&accountid=138040&jurisdiction=uk&realitycheck_uk_elapsed=664&realitycheck_uk_limit=1800&realitycheck_uk_history=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino%3Faccount%3Dtransaction-history&lobbyurl=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino&depositurl=https%3A%2F%2F127.0.0.1%3A3030%2Fcasino%3Faccount%3Dtop-up&realitycheck_uk_proceed=https%3A%2F%2F127.0.0.1%3A3030%2Fapi%2Fcasino%2Fgame%2Fproceed%2F138040-35222000-077c-11eb-ae95-5057d25f6201">this URI</a>, but future requests can still use the original URI.

*/
