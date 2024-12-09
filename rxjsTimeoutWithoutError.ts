import {Observable, of} from 'rxjs';
import {timeout, catchError} from 'rxjs/operators';

export function timeoutWithoutError<T, D>(timeoutMs?: number, defaultReturnValueWhenError: D | undefined = undefined): (source: Observable<T>) => Observable<T | D | undefined> {
    return (source: Observable<T>) => {
        if (timeoutMs === undefined) {
            return source;
        }
        return source.pipe(
            timeout(timeoutMs),
            catchError((err) => {
                if (err.name === 'TimeoutError') {
                    return of(defaultReturnValueWhenError);
                } else {
                    throw err;
                }
            })
        );
    };
}

