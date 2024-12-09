import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

export function rxjsCompare<T, D>(
    dataGetter: (T: T) => D,
    compareFunction: (T: D) => boolean
): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) => {
        return source.pipe(
            filter((T) => {
                const D = dataGetter(T);
                return compareFunction(D);
            }),
        );
    };
}

export function rxjsCompareOneOrMore<T, D>(
    dataGetter: (T: T) => D,
    k1: D,
    kn?: D[],
): (source: Observable<T>) => Observable<T> {
    return rxjsCompare(dataGetter, (D) => {
        if (k1 === D) {
            return true;
        }
        if (kn === undefined) {
            return false;
        }
        return kn.includes(D);
    });
}

