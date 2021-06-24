
export type JsonDataType = {
    type: 'json',
    json: unknown,
} | {
    type: 'text',
    text: string,
};

export const jsonParse = (data: string): JsonDataType => {
    try {
        const dataJson = JSON.parse(data);

        return {
            type: 'json',
            json: dataJson,
        };
    } catch (err) {
        return {
            type: 'text',
            text: data,
        };
    }
};
