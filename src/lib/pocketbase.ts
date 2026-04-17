import PocketBase from 'pocketbase';
import { cookies } from 'next/headers';
import { env } from './env';

// Helper to attach ngrok bypass headers to PocketBase client
function applyNgrokBypass(pb: PocketBase) {
  pb.beforeSend = function (url, options) {
    options.headers = Object.assign({}, options.headers, {
      'ngrok-skip-browser-warning': 'true',
    });
    return { url, options };
  };
  return pb;
}

// Return a new client for server-side auth
export async function getPbServerClient() {
  const pb = new PocketBase(env.POCKETBASE_URL);
  applyNgrokBypass(pb);
  
  // Sync with next cookies
  const cookieStore = await cookies();
  const pbCookie = cookieStore.get('pb_auth');
  
  if (pbCookie?.value) {
    pb.authStore.loadFromCookie(`pb_auth=${pbCookie.value}`);
  }
  
  try {
    if (pb.authStore.isValid) {
      // Opt out of refresh if you just want to trust the token silently to save cost,
      // but usually we refresh to get the latest user model state.
      await pb.collection('users').authRefresh();
    }
  } catch (_) {
    pb.authStore.clear();
  }

  return pb;
}

// Helper to suppress noisy fetch errors when PB is not running
function isConnectionError(error: any) {
  const msg = error?.message || '';
  const cause = error?.originalError?.cause?.code || error?.cause?.code || '';
  return msg.includes('fetch failed') || cause === 'ECONNREFUSED' || error?.status === 0;
}

// Return admin client for secure server-side operations
export async function getPbAdminClient() {
  const pb = new PocketBase(env.POCKETBASE_URL);
  applyNgrokBypass(pb);
  
  try {
    await pb.admins.authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);
  } catch (error: any) {
    if (isConnectionError(error)) {
      console.warn(`[PocketBase Admin] Could not connect to PocketBase at ${env.POCKETBASE_URL} (ECONNREFUSED).`);
    } else {
      console.error('[PocketBase Admin] Auth failed. Check credentials.', error?.message || error);
    }
  }
  
  return pb;
}

// Utility to set auth cookie properly after login/refresh
export async function setServerAuthCookie(pb: PocketBase) {
  const cookieStore = await cookies();
  if (pb.authStore.isValid) {
    const authString = pb.authStore.exportToCookie({ httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    // pb_auth=....; Path=/; Secure; HttpOnly
    const parts = authString.split(';');
    const cookieEntry = parts[0].split('=');
    
    cookieStore.set(cookieEntry[0], cookieEntry.slice(1).join('='), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
  } else {
    cookieStore.delete('pb_auth');
  }
}
