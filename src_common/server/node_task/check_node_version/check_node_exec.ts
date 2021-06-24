import { exec } from 'child_process';
import clc from 'cli-color';

export const execCommand = async (command: string): Promise<string> => new Promise((resolve, reject) => {
    console.info(`command => ${command}`);

    exec(command, {
        maxBuffer: 1024 * 1024 * 5
    }, (err: unknown, stdout: string, stderr: string) => {
        if (err !== null) {
            console.error(err);
            reject(err);
        }

        if (stderr !== '') {
            console.info(clc.blue(stderr));
        }
        resolve(stdout);
    });
});
