
export function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {

    if (a === null) { a = ''; }
    if (b === null) { b = ''; }

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export function padLeft(value, length) {
    return ('0'.repeat(length) + value).slice(-length);
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandom(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

/** Concatenate items onto an existing array, muting the source */
export function concatArray(ary: any[], newItems: any[]) {
    ary.push(...newItems);
}
