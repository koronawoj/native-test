import * as fs from 'fs';
import clc from 'cli-color';
import { SpecSource } from './getSpecSource';
import { getAllSpec, getAllSpecOne } from './getAllSpec';
import { getParams } from './getParams';
import { generateMethod } from './generateMethod';

/*
    npm run generate_openapi API_URL
    npm run generate_openapi http://10.19.0.21:8080 wallet

    api_openapi/generated
        wallet_method1
        wallet_method2
        etc ...
        other_module_method1
        other_module_method2
        etc ...
*/

const generateSpec = async (specPrefix: string, specSource: SpecSource, generatedDir: string): Promise<void> => {
    console.info(`generateSpec ${specPrefix} -> ${generatedDir}`);

    for (const [methodName, methodRequested] of Object.entries(specSource.methods)) {
        const methodDef = specSource.spec.paths.get(methodRequested.url);

        if (methodDef === undefined) {
            throw Error(`Problem of finding the method: ${specPrefix} -> ${methodRequested.url}`);
        }

        const specHandler = methodDef.get(methodRequested.method);

        if (specHandler === undefined) {
            throw Error(`Problem of finding the method: ${specPrefix} -> ${methodRequested.url} -> ${methodRequested.method}`);
        }

        const nameInFile = `openapi_${specPrefix}_${methodName}`;
        const asFile = `${generatedDir}/${nameInFile}.ts`;

        await generateMethod(asFile, nameInFile, methodRequested.url, methodRequested.method, specHandler);
    }
};

const runMain = async (): Promise<void> => {
    const { baseDir, apiUrl, targetSpec } = getParams();

    console.info('');
    console.info(clc.yellow('process.cwd(): ', process.cwd()));
    console.info(clc.yellow(`Base dir ${baseDir}`));
    console.info(clc.yellow(`API_URL: ${apiUrl}`));
    console.info(clc.yellow(`TargetSpec: ${targetSpec}`));
    console.info('');

    const generatedDir = `${baseDir}/generated`;

    if (targetSpec === 'all') {
        const listSpecSource = await getAllSpec(apiUrl, `${baseDir}/spec`);

        if (listSpecSource.has('all')) {
            throw Error('"all" is not allowed as a specification name');
        }

        console.info(`Reset generated dir ==> ${generatedDir}`);

        //@ts-expect-error
        await fs.promises.rmdir(generatedDir, { recursive: true });
        await fs.promises.mkdir(generatedDir);

        for (const [specPrefix, specSource] of listSpecSource) {
            await generateSpec(specPrefix, specSource, generatedDir);
        }
    } else {
        const specSource = await getAllSpecOne(apiUrl, `${baseDir}/spec`, targetSpec);
        await generateSpec(targetSpec, specSource, generatedDir);
    }
};

runMain().then(() => {
    console.info('');
    console.info(clc.green('run ok'));
    console.info('');
}).catch((error) => {
    console.error('run error', error);
});
