import {mergeWith, isArray, merge} from 'lodash';

export function deepMergeTwoObj<TObject, TSource>(object: TObject, source: TSource): TObject & TSource {
    return mergeWith(object, source, (objValue, srcValue) => {
        if (isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    });
}

export function deepMerge(...objects: any[]): any {
    return objects.reduce((result, obj) => {
        return deepMergeTwoObj(result, obj);
    }, {});
}

// // 使用示例
// interface ExampleObject {
//     a: number;
//     b: string;
//     c: {
//         d: number[];
//         e: string;
//     };
// }
//
// const objA: Partial<ExampleObject> = {a: 1, c: {d: [1, 2]}};
// const objB: Partial<ExampleObject> = {b: 'hello', c: {d: [3], e: 'world'}};
// const objC: Partial<ExampleObject> = {a: 2, c: {d: [4]}};
//
// const result = deepMerge<ExampleObject>(objA, objB, objC);
// console.log(result);
