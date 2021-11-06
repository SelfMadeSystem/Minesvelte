export function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export function mod(a: number, b: number): number {
  return (a % b + b) % b;
}

export function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

export function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

export function wrapAngle(angle: number): number {
  return mod(angle, 360);
}

export function inverseAngle(angle: number): number {
  return mod(angle + 180, 360);
}

export function approx(a: number, b: number, diff: number = 0.01): boolean {
  return Math.abs(a - b) < diff;
}