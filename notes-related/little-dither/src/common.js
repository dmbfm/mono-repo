const debug = true;

export function log(...args) {
    if (debug) console.log(...args);
}

export function assert(cond) {
    if (!cond) throw "Assert failed!";
}
