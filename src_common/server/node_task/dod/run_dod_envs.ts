import * as t from 'io-ts';
import inquirer from 'inquirer';
// eslint-disable-next-line import/no-relative-parent-imports
import { fetchGeneral } from '../../../common/fetch';

//@ts-expect-error
import execSh from 'exec-sh';
// eslint-disable-next-line import/no-relative-parent-imports
import { assertNever } from '../../../common/assertNever';

const execCommand = async (command: string, env: Record<string, string | undefined>): Promise<void> => {
    await execSh.promise(command, { env });
};

const ServiceItemIO = t.interface({
    API_PASSWORD: t.string,
    API_URL: t.string,
    API_USERNAME: t.string,
    CMS_DATABASE_URL: t.string,
    COUCHBASE: t.string,
    POSTGRESQL: t.string,
    PUBLIC_IP: t.string,
    REDIS_HOST: t.string,
    REDIS_PORT: t.number,
    WEBSOCKET_HOST: t.string,
    WEBSOCKET_HOST_V2: t.string,
});

type ServiceItemType = t.TypeOf<typeof ServiceItemIO>;

const DodResponseIO = t.record(t.string, t.unknown);

const selectOption = async (question: string, choices: Array<string>): Promise<string> => {
    const userOption = await inquirer
        .prompt([
            {
                type: 'list',
                loop: false,
                name: 'letter',
                message: question,
                choices: choices,
            }
        ]);

    return userOption.letter;
};

const getDodInfo = async (): Promise<Record<string, ServiceItemType>> => {
    const result = await fetchGeneral('GET', {
        url: 'http://www.dod.tup-cloud.com/api_info/',
        timeout: 'default',
    });

    if (result.body.type === 'json' && DodResponseIO.is(result.body.json)) {
        const data: Record<string, ServiceItemType> = {};

        for (const [key, item] of Object.entries(result.body.json)) {
            if (ServiceItemIO.is(item)) {
                data[key] = item;
            } else {
                console.error(`Environment data decoding error ${key}`, item);
            }
        }

        return data;
    }

    throw Error('A dictionary type data structure was expected ');
};

const selectEnvDod = async (dodInfo: Record<string, ServiceItemType>): Promise<string> => {
    const choices = [];
    choices.push('exit');
    for (const envName of Object.keys(dodInfo)) {
        choices.push(envName);
    }

    const envName = await selectOption('Select the environment to run', choices);

    return envName;
};

const selectUniverse = async (): Promise<string> => {
    const universes: Array<string> = ['exit', 'star', 'mcbookie', 'nebet', 'vickers', 'orbitalbet', 'rhino'];
    const universeName = await selectOption('Select universe to run', universes);

    return universeName;
};

const ApplicationTypeIO = t.union([t.literal('website'), t.literal('backoffice')]);

type ApplicationType = t.TypeOf<typeof ApplicationTypeIO>;

const getParamsForRun = (universeName: string, application: ApplicationType, dodItem: ServiceItemType): Record<string, string | undefined> => {
    if (application === 'website') {
        return {
            'NODE_ENV': 'development',
            'MODE': 'dev',
            'UNIVERSE': universeName,                       //mcbookie
            'OPERATOR': universeName,                       //=mcbookie
            'HTTP_INTERFACE': '0.0.0.0',
            'HTTP_PORT': '3030',
            'API_URL': dodItem.API_URL,                     //=http://10.1.0.113:8080
            // 'API_USERNAME': dodItem.API_USERNAME,           // =website2
            // 'API_PASSWORD': dodItem.API_PASSWORD,           // ='KD9234sdfASD123'
            'WEBSOCKET_HOST': dodItem.WEBSOCKET_HOST,       // =https://push-server.stg.sherbetcloud.com
            'WEBSOCKET_HOST_V2': dodItem.WEBSOCKET_HOST_V2, // ="wss://socket-mcbookie.stg.sherbetcloud.com/ws"
            'LOGS_FORMAT': 'pretty',
            'LOGS_LEVEL': 'debug',
            'POSTCODEANYWHERE_KEY': 'AR15-CD82-BP54-HT16',
            'PATH': process.env.PATH
        };
    } else if (application === 'backoffice') {
        return {
            'OPERATOR': universeName,
            'HTTP_INTERFACE': '0.0.0.0',
            'HTTP_PORT': '3000',
            'API_URL': dodItem.API_URL,
            'API_USERNAME': dodItem.API_USERNAME,
            'API_PASSWORD': dodItem.API_PASSWORD,
            'WEBSOCKET_HOST': dodItem.WEBSOCKET_HOST,       // =https://push-server.stg.sherbetcloud.com
            'LOGS_FORMAT': 'pretty',
            'LOGS_LEVEL': 'debug',
            'PATH': process.env.PATH,
        };
    } else {
        return assertNever('application ', application);
    }
};

const runMain = async (): Promise<void> => {

    const application = process.argv[2];
    const command = process.argv[3];

    if (!ApplicationTypeIO.is(application)) {
        throw Error('Select an application to run');
    }

    if (!t.string.is(command) || command === '') {
        throw Error('Specify the webpack configuration');
    }

    const dodInfo = await getDodInfo();

    const envName = await selectEnvDod(dodInfo);

    if (envName === 'exit') {
        return;
    }

    const universeName = await selectUniverse();
    if (universeName === 'exit') {
        return;
    }

    const dodItem = dodInfo[envName];

    if (dodItem === undefined) {
        throw Error(`Missing: ${envName}`);
    }

    console.info('envName ->', envName);
    console.info('universeName -> ', universeName);
    console.info('');
    console.info('');


    const params = getParamsForRun(universeName, application, dodItem);
    const commandToRun = `node ./node_modules/.bin/webpack --mode development --config ${command} --watch`;

    console.info(`Run application: ${application}`);
    console.info('Env params', params);
    console.info(`Command: ${commandToRun}`);
    console.info('');
    console.info('');

    await execCommand(commandToRun, params);
};


runMain().catch((err) => {
    console.error(err);
    process.exit(1);
});

