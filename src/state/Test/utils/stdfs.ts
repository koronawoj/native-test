import * as fs from 'fs';
import { exec } from 'child_process';

export const readFile = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err: unknown, data: string) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
};


export const getListFromDirRaw = (pathIn: string): Promise<Array<string>> => {
    return new Promise((resolve, reject) => {
        fs.readdir(pathIn, (err: unknown, files: Array<string>) => {
            if (err !== null) {
                reject(err);
                return;
            }

            resolve(files);
        });
    });
};

export const getListFromDir = async (pathIn: string): Promise<Array<string>> => {

    const out = await getListFromDirRaw(pathIn);
    return out.map(file => `${pathIn}/${file}`);
};

export const writeFile = async (filePath: string, dataToSave: string) => {
    return new Promise((resolve: () => void, reject) => {
        fs.writeFile(filePath, dataToSave, (err: unknown) => {
            if (err !== null) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

export const appendFile = async (filePath: string, dataToSave: string) => {
    return new Promise((resolve: () => void, reject) => {
        const options = {
            encoding: 'utf8',
            flag: 'a'
        };

        fs.writeFile(filePath, dataToSave, options, (err: unknown) => {
            if (err !== null) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};

export const removeFile = async (filePath: string) => {
    return new Promise((resolve: () => void, reject) => {
        fs.unlink(filePath, (err: unknown) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

export const rename = async (oldPath: string, newPath: string) => {
    return new Promise((resolve: () => void, reject) => {
        fs.rename(oldPath, newPath, (err: unknown) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};

export const lstat = async (path: string): Promise<'file'|'dir'> => {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (err, result) => {
            if (err !== null) {
                reject(err);
                return;
            }

            if (result.isDirectory()) {
                resolve('dir');
                return;
            }

            if (result.isFile()) {
                resolve('file');
                return;
            }

            reject(new Error(`Expected file or directory in ${path}`));
        });
    });
};

export const mkdirRecursive = async (path: string) => {
    return new Promise((resolve: () => void, reject) => {
        fs.mkdir(path, { recursive: true }, (err: unknown) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};

export const mkdir = async (path: string) => {
    return new Promise((resolve: () => void, reject) => {
        fs.mkdir(path, (err: unknown) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
};

export interface ExecResultType {
    stdout: string,
    stderr: string
}

export const execCommand = async (command: string): Promise<ExecResultType> => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error !== null) {
                reject(error);
                return;
            }

            resolve({
                stdout,
                stderr
            });
        });
    });
};
