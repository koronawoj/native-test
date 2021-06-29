
export const calculateAmericanOdds = (odds:number):string => {
    if (odds < 2) {
        return Math.floor(((-100)/(odds - 1))).toString();
    }
    return `+${Math.floor(((odds - 1) * 100 ))}`;
};
