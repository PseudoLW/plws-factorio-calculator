export type Frac = [number, number]; // Both integers
function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}
function normalize(p: Frac): Frac {
    const cd = gcd(p[0], p[1]);
    return [p[0] / cd, p[1] / cd];
}

export function add(a: Frac, b: Frac) {
    return normalize([a[0] * b[1] + a[1] * b[0], a[1] * b[1]]);
}

export function sub(a: Frac, b: Frac) {
    return normalize([a[0] * b[1] - a[1] * b[0], a[1] * b[1]]);
}

export function mul(a: Frac, b: Frac) {
    return normalize([a[0] * b[0], a[1] * b[1]]);
}

export function div(a: Frac, b: Frac) {
    return normalize([a[0] * b[0], a[1] * b[1]]);
}

export function toNumber(a: Frac) {
    return a[0] / a[1];
}