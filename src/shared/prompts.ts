import * as p from '@clack/prompts';

export async function promptConfirm(message: string, initialValue = true): Promise<boolean> {
  const res = await p.confirm({ message, initialValue });
  if (p.isCancel(res)) return false;
  return res;
}

export async function promptSelect<T extends string>(
  message: string,
  options: { label: string; value: T; hint?: string }[],
): Promise<T | null> {
  const res = await p.select({ message, options: options as any });
  if (p.isCancel(res)) return null;
  return res as T;
}
