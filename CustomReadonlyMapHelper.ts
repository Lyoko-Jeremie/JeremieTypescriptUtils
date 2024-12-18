export abstract class CustomReadonlyMapHelper<K, V> implements ReadonlyMap<K, V> {

    abstract get size(): number;

    abstract get(key: K): V | undefined;

    abstract has(key: K): boolean;

    abstract entries(): ReturnType<ReadonlyMap<K, V>['entries']>;

    [Symbol.iterator]() {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void {
        for (const nn of this.entries()) {
            callback(nn[1], nn[0], this);
        }
    }

    keys(): ReturnType<ReadonlyMap<K, V>['keys']> {
        return this.entries().map(T => T[0]);
    }

    values(): ReturnType<ReadonlyMap<K, V>['values']> {
        return this.entries().map(T => T[1]);
    }

}
