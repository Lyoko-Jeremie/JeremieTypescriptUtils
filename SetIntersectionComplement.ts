
// 交集
// 易理解的方法
export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA].filter(x => setB.has(x)));
}

// 高效的方法
export function efficientIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of setA) {
        if (setB.has(item)) {
            result.add(item);
        }
    }
    return result;
}

// 并集
// 易理解的方法
export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA, ...setB]);
}

// 高效的方法
export function efficientUnion<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set(setA);
    for (const item of setB) {
        result.add(item);
    }
    return result;
}

// 补集 (setA相对于setB的补集)
// 易理解的方法
export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA].filter(x => !setB.has(x)));
}

// 高效的方法
export function efficientDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of setA) {
        if (!setB.has(item)) {
            result.add(item);
        }
    }
    return result;
}


// 对称差 (A和B中不重叠的部分)
// 易理解的方法
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const differenceAB = new Set([...setA].filter(x => !setB.has(x)));
    const differenceBA = new Set([...setB].filter(x => !setA.has(x)));
    return new Set([...differenceAB, ...differenceBA]);
}

// 高效的方法
export function efficientSymmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set<T>();
    for (const item of setA) {
        if (!setB.has(item)) {
            result.add(item);
        }
    }
    for (const item of setB) {
        if (!setA.has(item)) {
            result.add(item);
        }
    }
    return result;
}

// 使用已有的方法实现对称差的另一种方式
export function symmetricDifference2<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return union(difference(setA, setB), difference(setB, setA));
}

// 为了明确起见，我们可以使用之前定义的efficientUnion和efficientDifference
export function symmetricDifferenceEfficient2<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return efficientUnion(
        efficientDifference(setA, setB),
        efficientDifference(setB, setA)
    );
}

// 另一种实现方式：使用并集和交集
export function symmetricDifferenceUsingUnionAndIntersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const unionSet = union(setA, setB);
    const intersectionSet = intersection(setA, setB);
    return difference(unionSet, intersectionSet);
}

// 另一种实现方式：使用并集和交集
export function symmetricDifferenceUsingUnionAndIntersectionEfficient<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const unionSet = efficientUnion(setA, setB);
    const intersectionSet = efficientIntersection(setA, setB);
    return efficientDifference(unionSet, intersectionSet);
}

