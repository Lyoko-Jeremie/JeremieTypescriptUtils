export type AtLeastOneField<T> = {
    [K in keyof T]: Pick<T, K>;
}[keyof T] & Partial<T>;

interface B {
    a: string;
    b: number;
}

type A = AtLeastOneField<B>;

const a1: A = {a: 'a'};
const a2: A = {b: 1};
const a3: A = {a: 'a', b: 1};
// const aE1: A = {};  // TS2322: Type {} is not assignable to type A
// const aE2: A = {a: 'a', b: 1, c: true};  // Error: Object literal may only specify known properties, and 'c' does not exist in type 'AtLeastOneField<B>'
