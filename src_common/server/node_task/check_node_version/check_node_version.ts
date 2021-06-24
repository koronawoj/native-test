import clc from 'cli-color';
import { checkCherryPick } from './check_cherry_pick';
import { execCommand } from './check_node_exec';
import { checkSubmoldule } from './check_node_submodule';

const NODE_VERSION = 'v12.14.1';
const NPM_VERSION = '6.13.4';
//const NPM_REGISTRY = 'http://npmregistry.tup-cloud.com:4873/';
const NPM_REGISTRY = 'https://registry.npmjs.org/';

const execCommandAndTrim = async (command: string): Promise<string> => {
    const result = await execCommand(command);

    return result.trim();
};

console.info('Checking node version ...');

const main = async (): Promise<void> => {
    const result1 = await execCommandAndTrim('node -v');

    if (result1 !== NODE_VERSION) {
        return Promise.reject(clc.red(`Expected nodejs in version ${NODE_VERSION} (current ${result1})`));
    }

    console.info(clc.green(`Node version ${result1} - OK`));

    const result2 = await execCommandAndTrim('npm -v');

    if (result2 !== NPM_VERSION) {
        return Promise.reject(clc.red(`Expected npm in version ${NPM_VERSION} (current ${result2})`));
    }

    console.info(clc.green(`Npm version ${result2} - OK`));

    const result3 = await execCommandAndTrim('npm get registry');

    if (result3 !== NPM_REGISTRY) {
        return Promise.reject(clc.red(`Please run command "npm set registry ${NPM_REGISTRY}"  (current ${result3})`));
    }

    console.info(clc.green(`Npm registry: ${result3} - OK`));

    await execCommandAndTrim('rm -f config.json');
    await execCommandAndTrim('rm -f meta-build.json');

    await checkSubmoldule();
    await checkCherryPick(4);
};

main().then(() => {
    console.info(clc.green('Check env OK'));
    console.info('');
}).catch((err) => {
    console.error(err);
    console.info('');
    process.exit(1);
});
