// 计算交集
export function intersection<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const result = new Map<K, V>();
    for (const [key, value] of map1) {
        if (map2.has(key) && map2.get(key) === value) {
            result.set(key, value);
        }
    }
    return result;
}

// 未优化的只检查键的交集
export function keyOnlyIntersection<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const result = new Map<K, V>();

    for (const [key, value] of map1) {
        if (map2.has(key)) {
            result.set(key, value);
        }
    }

    return result;
}

// 计算补集
// 从map1中去除map2中的所有key
export function complement<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const result = new Map<K, V>(map1);
    for (const key of map2.keys()) {
        result.delete(key);
    }
    return result;
}

// 未优化的并集计算
export function unoptimizedUnion<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const result = new Map<K, V>();

    // 添加 map1 的所有元素
    for (const [key, value] of map1) {
        result.set(key, value);
    }

    // 添加 map2 的所有元素，覆盖重复的键
    for (const [key, value] of map2) {
        result.set(key, value);
    }

    return result;
}



// 优化的交集计算
export function optimizedIntersection<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const [smallerMap, largerMap] = map1.size < map2.size ? [map1, map2] : [map2, map1];
    return new Map(
        Array.from(smallerMap).filter(([key, value]) => largerMap.get(key) === value)
    );
}

// 优化的只检查键的交集
export function optimizedKeyOnlyIntersection<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const [smallerMap, largerMap] = map1.size < map2.size ? [map1, map2] : [map2, map1];
    return new Map(
        Array.from(smallerMap).filter(([key]) => largerMap.has(key))
    );
}

// 优化的补集计算
export function optimizedComplement<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    return new Map(
        Array.from(map1).filter(([key]) => !map2.has(key))
    );
}

// 优化的并集计算
export function optimizedUnion<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
    const result = new Map(map1);
    for (const [key, value] of map2) {
        result.set(key, value);
    }
    return result;
}
