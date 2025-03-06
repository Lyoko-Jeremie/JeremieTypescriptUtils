import {isObject, isArray, transform} from 'lodash';

// covert bigint to number or string for json stringify
export function convertBigIntToString<T>(obj: T): T {
    const replacer: (value: any) => any = (value: any): any => {
        if (typeof value === 'bigint') {
            const numberValue = Number(value);
            if (BigInt(numberValue) !== value) {
                return value.toString()
            }
            return numberValue;
        }
        if (isArray(value)) {
            return value.map(replacer);
        }
        if (isObject(value)) {
            return transform(value, (result, val, key) => {
                result[key] = replacer(val);
            });
        }
        return value;
    };
    return replacer(obj);
}


// // Example usage
// const obj = {
//     id: 1n,
//     name: "example",
//     value: 123n,
//     kk: 666,
// };
//
// const convertedObj = convertBigIntToString(obj);
// const jsonString = JSON.stringify(convertedObj);
// console.log(jsonString); // {"id":"1","name":"example","value":"123"}

export type ConvertStringToBigintSafeReturnType = { ok: false, b: string | number } | { ok: true, b: bigint };

export function convertStringToBigintSafe(s: string | number): ConvertStringToBigintSafeReturnType {
    try {
        return {
            ok: true,
            b: BigInt(s),
        };
    } catch (e) {
        return {
            ok: false,
            b: s,
        };
    }
}
