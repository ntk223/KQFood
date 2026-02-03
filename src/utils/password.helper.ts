import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPasword(plainPassword: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashedPassword;
}

export function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
