export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [K in keyof T as T[K]]: K;
};
