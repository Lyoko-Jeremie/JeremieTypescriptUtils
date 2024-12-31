export class IterableMapIterator<T> implements MapIterator<T> {

    static warp(iterable: Iterable<any>): IterableMapIterator<any> {
        return new IterableMapIterator(iterable);
    }

    private iterator: Iterator<T>;

    constructor(iterable: Iterable<T>) {
        this.iterator = iterable[Symbol.iterator]();
    }

    next(): IteratorResult<T> {
        return this.iterator.next();
    }

    [Symbol.iterator](): MapIterator<T> {
        return this;
    }

    map<U>(fn: (value: T, index: number) => U): MapIterator<U> {
        const self = this;
        return new IterableMapIterator({
            * [Symbol.iterator]() {
                let i = 0;
                for (const item of self) {
                    yield fn(item, i);
                    ++i;
                }
            }
        });
    }

    filter(predicate: (value: T, index: number) => boolean): MapIterator<T> {
        const self = this;
        return new IterableMapIterator({
            * [Symbol.iterator]() {
                let i = 0;
                for (const item of self) {
                    if (predicate(item, i)) {
                        yield item;
                    }
                    ++i;
                }
            }
        });
    }

    forEach(fn: (value: T, index: number) => void): void {
        let i = 0;
        for (const item of this) {
            fn(item, i);
            ++i;
        }
    }

    /**
     * Calls the specified callback function for all the elements in this iterator. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
     * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of a value from the iterator.
     */
    reduce(reducer: (acc: T, value: T, currentIndex: number) => T): T;
    reduce(reducer: (acc: T, value: T, currentIndex: number) => T, initialValue: T): T;
    reduce<U>(reducer: (acc: U, value: T, index: number) => U, initialValue?: U): U {
        let result: IteratorResult<T>;
        let acc: U;
        let index = 0;

        if (initialValue === undefined) {
            result = this.next();
            if (result.done) {
                throw new TypeError('Reduce of empty iterator with no initial value');
            }
            acc = result.value as any;
            ++index;
        } else {
            acc = initialValue;
        }

        for (const item of this) {
            acc = reducer(acc, item, index);
            ++index;
        }

        return acc;
    }

    some(predicate: (value: T, index: number) => boolean): boolean {
        let i = 0;
        for (const item of this) {
            if (predicate(item, i)) {
                return true;
            }
            ++i;
        }
        return false;
    }

    every(predicate: (value: T, index: number) => boolean): boolean {
        let i = 0;
        for (const item of this) {
            if (!predicate(item, i)) {
                return false;
            }
            ++i;
        }
        return true;
    }

    find(predicate: (value: T, index: number) => boolean): T | undefined {
        let i = 0;
        for (const item of this) {
            if (predicate(item, i)) {
                return item;
            }
            ++i;
        }
        return undefined;
    }

    findIndex(predicate: (value: T) => boolean): number {
        let index = 0;
        for (const item of this) {
            if (predicate(item)) {
                return index;
            }
            index++;
        }
        return -1;
    }

    includes(searchElement: T): boolean {
        for (const item of this) {
            if (item === searchElement) {
                return true;
            }
        }
        return false;
    }

    drop(count: number): MapIterator<T> {
        const self = this;
        return new IterableMapIterator({
            * [Symbol.iterator]() {
                let dropped = 0;
                for (const item of self) {
                    if (dropped >= count) {
                        yield item;
                    }
                    dropped++;
                }
            }
        });
    }

    take(limit: number): MapIterator<T> {
        const self = this;
        return new IterableMapIterator({
            * [Symbol.iterator]() {
                let count = 0;
                for (const item of self) {
                    if (count >= limit) break;
                    yield item;
                    count++;
                }
            }
        });
    }

    flatMap<U>(callback: (value: T, index: number) => (Iterator<U> | Iterable<U>)): MapIterator<U> {
        const self = this;
        return new IterableMapIterator({
            * [Symbol.iterator]() {
                let index = 0;
                for (const item of self) {
                    const iterableOrIterator = callback(item, index++);
                    const iterator = Symbol.iterator in iterableOrIterator
                        ? (iterableOrIterator as Iterable<U>)[Symbol.iterator]()
                        : iterableOrIterator as Iterator<U>;

                    let result = iterator.next();
                    while (!result.done) {
                        yield result.value;
                        result = iterator.next();
                    }
                }
            }
        });
    }

    toArray(): T[] {
        return [...this];
    }

    readonly [Symbol.toStringTag]: string = 'IterableMapIterator';

    [Symbol.dispose](): void {
        this.iterator = undefined as any;
    }

}

// // 使用示例
// function* numberGenerator() {
//     yield* [1, 2, 3, 4, 5];
// }
//
// // 将一个 IterableIterator 转换为 MapIterator
// const mapIterator = new IterableMapIterator(numberGenerator());
//
// // 使用 MapIterator 的方法
// const result = mapIterator
//     .map(x => x * 2)
//     .filter(x => x > 5)
//     .take(2)
//     .toArray();
//
// console.log(result); // [6, 8]
