// Client-side auth utilities

// Extension ID - MUST be set for chrome.runtime.sendMessage to work from webpage
// Get this from chrome://extensions/ when you load the unpacked extension
// For development: Set this in .env.local as NEXT_PUBLIC_EXTENSION_ID
// For production: Will be the published extension ID
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || '';

// Sync token with Chrome extension via content script bridge
function syncTokenWithExtension(token: string | null) {
  console.log('[AUTH-SYNC] 🚀 syncTokenWithExtension called with token:', token ? `${token.substring(0, 20)}...` : 'null');

  if (typeof window === 'undefined') {
    console.log('[AUTH-SYNC] ❌ Window not available (SSR)');
    return;
  }

  try {
    // Use window.postMessage to communicate with content script
    // Content script acts as bridge to extension background
    const message = token
      ? { type: 'FRATGPT_SET_TOKEN', token }
      : { type: 'FRATGPT_REMOVE_TOKEN' };

    console.log('[AUTH-SYNC] 📤 Posting message to content script:', message.type);
    console.log('[AUTH-SYNC] Token length:', token ? token.length : 0);

    // Post message to same window - content script will relay to extension
    window.postMessage(message, '*');
    console.log('[AUTH-SYNC] ✅ Message posted to content script bridge');

    // Listen for response from content script
    const responseListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'FRATGPT_AUTH_RESPONSE') {
        console.log('[AUTH-SYNC] 📬 Response from extension:', event.data);
        if (event.data.success) {
          console.log('[AUTH-SYNC] ✅ Extension successfully saved token!');
        } else {
          console.log('[AUTH-SYNC] ⚠️ Extension error:', event.data.error || 'Unknown error');
        }
        window.removeEventListener('message', responseListener);
      }
    };

    window.addEventListener('message', responseListener);

    // Timeout to remove listener if no response
    setTimeout(() => {
      window.removeEventListener('message', responseListener);
    }, 5000);

  } catch (err) {
    console.log('[AUTH-SYNC] ❌ Error syncing with extension:', err);
  }
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    console.log('[AUTH] 🔐 Saving token:', token.substring(0, 20) + '...');
    localStorage.setItem('authToken', token);
    console.log('[AUTH] ✓ Token saved to localStorage');

    // Sync with extension
    console.log('[AUTH] 🔄 About to call syncTokenWithExtension...');
    syncTokenWithExtension(token);
    console.log('[AUTH] ✓ Extension sync initiated');

    // Dispatch event so Navigation and other components know user logged in
    window.dispatchEvent(new CustomEvent('fratgpt-auth-change', { detail: { action: 'login' } }));
    console.log('[AUTH] ✓ Login event dispatched');
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    console.log('[AUTH] 🔍 Getting token:', token ? `Found: ${token.substring(0, 20)}...` : 'NOT FOUND');
    return token;
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    console.log('[AUTH] 🚪 Removing token - logging out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('cachedUser');
    console.log('[AUTH] ✓ Token and cached user removed');

    // Sync logout with extension
    syncTokenWithExtension(null);
    console.log('[AUTH] ✓ Extension logout sync initiated');

    // Dispatch event so Navigation and other components know user logged out
    window.dispatchEvent(new CustomEvent('fratgpt-auth-change', { detail: { action: 'logout' } }));
    console.log('[AUTH] ✓ Logout event dispatched');
  }
}

export function isAuthenticated(): boolean {
  const hasToken = getToken() !== null;
  console.log('[AUTH] 🔐 isAuthenticated check:', hasToken ? 'YES' : 'NO');
  return hasToken;
}
