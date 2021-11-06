export function equals(a: any, b: any): boolean {
    if (a === b) {
        return true;
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (a != null && b != null) {
        if (typeof a.equals === 'function') {
            return a.equals(b);
        }
        if (typeof a === 'object' && typeof b === 'object') {
            return Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(key => equals(a[key], b[key]));
        }
    }
    return false;
}