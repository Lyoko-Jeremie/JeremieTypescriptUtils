export type SortUnion<T, U extends T = T> = [T] extends [never]
    ? []
    : T extends U
        ? [T, ...SortUnion<Exclude<U, T>>]
        : [];

// 使用示例
type Colors = "red" | "green" | "blue";
type SortedColors = SortUnion<Colors>;
// 结果: ["blue", "green", "red"]

