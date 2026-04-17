import { kv } from './kv';

export async function isNonceUsed(nonce: string): Promise<boolean> {
  const used = await kv.get(`nonce:${nonce}`);
  return !!used;
}

export async function markNonceUsed(nonce: string) {
  // Store for 10 minutes to prevent replay during token validity window
  await kv.set(`nonce:${nonce}`, true, 600);
}
