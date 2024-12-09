export type HasProperty<T, K extends string> = K extends keyof T ? true : false;
export type ExcludeProperty<T, K extends string> = HasProperty<T, K> extends true ? never : T;

function someFunction<T>(arg: ExcludeProperty<T, "specificProperty">) {
    // 函数实现
}
