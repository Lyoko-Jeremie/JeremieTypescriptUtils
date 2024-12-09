import {cloneDeep, cloneDeepWith, forEach, isArray, isObject, isPlainObject, isString} from "lodash";

export function deepCleanObject<T>(
    obj: T,
    keyPattern: string | RegExp,
    replacementValue: any
): T {
    return cloneDeepWith(obj, (value) => {
        if (isObject(value) && !isArray(value)) {
            const cleanedObj: any = {};
            forEach(value, (v, k) => {
                if (isString(k) && k.match(keyPattern)) {
                    cleanedObj[k] = replacementValue;
                } else {
                    cleanedObj[k] = deepCleanObject(v, keyPattern, replacementValue);
                }
            });
            return cleanedObj;
        }
    });
}


export function deepCleanObjectIterative<T>(
    obj: T,
    keyPattern: string | RegExp,
    replacementValue: any
): T {
    const stack: Array<{ parent: any; key: string | number; value: any }> = [
        {parent: null, key: '', value: obj},
    ];
    const result = cloneDeep(obj);

    while (stack.length > 0) {
        const {parent, key, value} = stack.pop()!;

        if (isObject(value) && !isArray(value)) {
            for (const [k, v] of Object.entries(value)) {
                if (isString(k) && k.match(keyPattern)) {
                    (value as any)[k] = replacementValue;
                } else if (isObject(v)) {
                    stack.push({parent: value, key: k, value: v});
                }
            }
        }

        if (parent) {
            parent[key] = value;
        }
    }

    return result;
}
