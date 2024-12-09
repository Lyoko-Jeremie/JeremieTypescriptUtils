import {isEqual} from 'lodash';
import {Value, Edit} from '@sinclair/typebox/value';

export function isEqualLodash(a: any, b: any): boolean {
    return isEqual(a, b);
}

export function isEqualTypeBox(a: any, b: any): boolean {
    return Value.Equal(a, b);
}

export function diffInfo(a: any, b: any): Edit[] {
    return Value.Diff(a, b);
}
