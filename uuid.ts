import {v7 as uuid} from 'uuid';

export function getUuid(): string {
    return uuid();
}
