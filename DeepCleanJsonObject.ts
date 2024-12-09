import {omitBy, isNull, isObject, mapValues, isUndefined} from 'lodash';

export function removeNullDeep(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(removeNullDeep);
    } else if (isObject(obj)) {
        return mapValues(omitBy(obj, isNull), removeNullDeep);
    }
    return obj;
}

export function removeUndefinedDeep(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(removeUndefinedDeep);
    } else if (isObject(obj)) {
        return mapValues(omitBy(obj, isUndefined), removeUndefinedDeep);
    }
    return obj;
}

