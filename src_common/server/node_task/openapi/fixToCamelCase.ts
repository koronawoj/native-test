

const firstLetterToUp = (name: string): string => name.charAt(0).toUpperCase() + name.slice(1);

export const fixToCamelCase = (paramName: string): string => {
    const out = [];

    const chunks = paramName.split('-');

    const first = chunks.shift();

    if (first !== undefined) {
        out.push(first);
    }

    for (const item of chunks) {
        out.push(firstLetterToUp(item));
    }

    return out.join('');
};
