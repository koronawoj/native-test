export const generateIdent = (ident: number): string => {
    const out: Array<string> = [];
    for (let i=0; i<ident; i++) {
        out.push(' ');
    }
    return out.join('');
};
