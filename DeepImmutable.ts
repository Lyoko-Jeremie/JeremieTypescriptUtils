// https://github.com/microsoft/TypeScript/issues/13923

export type DeepImmutable<T> =
    T extends Map<infer K, infer V>
        ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
        : T extends Set<infer S>
            ? ReadonlySet<DeepImmutable<S>>
            : T extends object
                ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
                : T;

export type ImmutableMap<T> = T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>> : T;

export type ImmutableSet<T> = T extends Set<infer S>
    ? ReadonlySet<DeepImmutable<S>> : T;

export type ImmutableObject<T> = T extends object
    ? { readonly [K in keyof T]: DeepImmutable<T[K]> } : T;

