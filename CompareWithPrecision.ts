/***
 // from claude 3.5 sonnet
 // 在比较之前将两个数都四舍五入到特定的小数位数
 ***/

function compareWithPrecisionNormal(a: number, b: number, precision: number): boolean {
    const factor = Math.pow(10, precision);
    return Math.round(a * factor) === Math.round(b * factor);
}

// 内联数学运算
export function compareWithPrecisionInline(a: number, b: number, precision: number): boolean {
    const factor = 10 ** precision;
    const diff = a * factor - b * factor;
    return diff > -0.5 && diff < 0.5;
}


// // 使用示例
// console.log(compareWithPrecision(3.14159, 3.14161, 4)); // true
// console.log(compareWithPrecision(3.14159, 3.14161, 5)); // false


// const getPrecisionFactor = (precision: number) => 1 << (precision * 3.32192809488736);
export const getPrecisionFactor = (precision: number) => Math.pow(10, precision);

export function compareWithPrecisionFactor(a: number, b: number, factor: number): boolean {
    // return Math.round(a * factor) === Math.round(b * factor);
    const diff = a * factor - b * factor;
    return diff > -0.5 && diff < 0.5;
}

export enum PrecisionFactorPreDefine {
    Precision4 = 10000,
    Precision5 = 100000,
    Precision6 = 1000000,
    Precision7 = 10000000,
    Precision8 = 100000000,
    Precision9 = 1000000000,
    Precision10 = 10000000000,
}

// // 使用
// const factor = getPrecisionFactor(4);
// console.log(compareWithPrecisionFactor(3.14159, 3.14161, factor)); // true
// console.log(compareWithPrecisionFactor(3.14159, 3.14171, factor)); // false
