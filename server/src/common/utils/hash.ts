import * as argon2 from 'argon2';

export function hashGenerate(value: string, secret: string) {
  return argon2.hash(value, { secret: Buffer.from(secret) });
}

export function hashCompare(origin: string, hashed: string, secret: string) {
  return argon2.verify(hashed, origin, { secret: Buffer.from(secret) });
}
