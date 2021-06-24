import { getAllUniverseStr } from 'src_common/common/universe';


const isWord = (chunkIn: string, testChar: (char: string) => boolean): boolean => {
    const chunk = chunkIn.trim();
    if (chunk === '') {
        return false;
    }

    for (let i=0; i<chunk.length; i++) {
        const char = chunk[i];
        if (char === undefined) {
            //unexpected situation
            return false;
        }

        if (testChar(char) === false) {
            return false;
        }
    }
    return true;
};


const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const isNumber = (chunk: string): boolean => isWord(chunk, char => numbers.includes(char));

const uuidChars = ['a', 'b', 'c', 'd', 'e', 'f', '-'];

const isUuidChar = (char: string): boolean => numbers.includes(char) || uuidChars.includes(char);

const isUuid = (chunk: string): boolean => isWord(chunk, isUuidChar);


const isUniverse = (chunk: string): boolean => getAllUniverseStr().includes(chunk);

const isRole = (chunk: string): boolean => ['anonymous', 'customer', 'staff', 'program'].includes(chunk);

const mapItem = (chunk: string): string => {
    if (isRole(chunk)) {
        return ':role';
    }

    if (isNumber(chunk)) {
        return ':number';
    }

    if (isUniverse(chunk)) {
        return ':universe';
    }

    if (isUuid(chunk)) {
        return ':uuid';
    }

    return chunk;
};

export const logNormalizePath = (path: string): string => {
    const newChunks = path
        .split('/')
        .filter(char => char.trim() !== '')
        .map(mapItem);

    return `/${newChunks.join('/')}`;
};
