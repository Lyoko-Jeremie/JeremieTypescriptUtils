import {} from 'lodash';
import {} from 'moment';
import {ReturnType} from 'tsafe';
import {getLogger} from "../LogSystem";

export class CallCounter {
    _counter = 0;

    constructor(
        public logger: ReturnType<typeof getLogger>,
    ) {
    }

    plus(n = 1) {
        this._counter = this._counter + n;
    }

}

