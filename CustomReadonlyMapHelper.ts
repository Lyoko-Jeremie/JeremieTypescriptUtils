import {CustomIterableIterator} from "./CustomIterableIterator";

export abstract class CustomReadonlyMapHelper<K, V> implements ReadonlyMap<K, V> {

    abstract get size(): number;

    abstract get(key: K): V | undefined;

    abstract has(key: K): boolean;

    abstract entries(): IterableIterator<[K, V]>;

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void {
        for (const nn of this.entries()) {
            callback(this.get(nn[0])!, nn[0], this);
        }
    }

    keys(): IterableIterator<K> {
        return new CustomIterableIterator<K, typeof this, [K, V][]>(
            this,
            (index, p, ito) => {
                return {
                    done: index >= this.size,
                    value: ito.cache[index]?.[0],
                };
            },
            Array.from(this.entries()),
        );
    }

    values(): IterableIterator<V> {
        return new CustomIterableIterator<V, typeof this, [K, V][]>(
            this,
            (index, p, ito) => {
                return {
                    done: index >= this.size,
                    value: ito.cache[index]?.[1],
                };
            },
            Array.from(this.entries()),
        );
    }

}
