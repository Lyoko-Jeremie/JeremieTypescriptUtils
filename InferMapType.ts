export type MapKeyType<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never;

export type MapValueType<T extends Map<any, any>> = T extends Map<any, infer V> ? V : never;


