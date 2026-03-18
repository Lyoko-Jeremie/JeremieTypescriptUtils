/**
 * 递归遍历并过滤非 JSON 序列化的类型
 */
type VerifyJson<T> =
// 1. 允许的基础 JSON 类型 (undefined 在对象中会被忽略，通常允许存在于接口的可选属性中)
    T extends string | number | boolean | null | undefined ? T :

        // 2. 明确拒绝的不可序列化类型
        T extends Function | symbol | bigint ? never :

            // 3. 允许 Date 类型 (JSON.stringify 默认支持，会将其转为 ISO 字符串。若你想严格拒绝，可改为 never)
            T extends Date ? T :

                // 4. 处理数组和元组，递归校验每一个元素
                T extends readonly any[] ? { [K in keyof T]: VerifyJson<T[K]> } :

                    // 5. 处理普通对象/接口，递归校验每一个属性
                    T extends object ? { [K in keyof T]: VerifyJson<T[K]> } :

                        // 6. 兜底拒绝其他未知类型
                        never;

/**
 * 判断类型 T 是否完全可以被 JSON 序列化
 * (使用 [T] extends 包裹是为了防止 TypeScript 在处理联合类型时触发条件分配)
 */
export type IsJsonSerializable<T> = [T] extends [VerifyJson<T>] ? true : false;
