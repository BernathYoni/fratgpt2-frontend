// Client-side auth utilities

// Extension ID - MUST be set for chrome.runtime.sendMessage to work from webpage
// Get this from chrome://extensions/ when you load the unpacked extension
// For development: Set this in .env.local as NEXT_PUBLIC_EXTENSION_ID
// For production: Will be the published extension ID
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || '';

// Sync token with Chrome extension
function syncTokenWithExtension(token: string | null) {
  console.log('[AUTH-SYNC] 🚀 syncTokenWithExtension called with token:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('[AUTH-SYNC] Extension ID configured:', EXTENSION_ID || 'NOT SET');

  if (!EXTENSION_ID) {
    console.log('[AUTH-SYNC] ⚠️ EXTENSION_ID not configured. Please set NEXT_PUBLIC_EXTENSION_ID in .env.local');
    console.log('[AUTH-SYNC] To find your extension ID:');
    console.log('[AUTH-SYNC] 1. Go to chrome://extensions/');
    console.log('[AUTH-SYNC] 2. Enable Developer mode');
    console.log('[AUTH-SYNC] 3. Find "FratGPT 2.0" and copy the ID');
    console.log('[AUTH-SYNC] 4. Add to .env.local: NEXT_PUBLIC_EXTENSION_ID=your_id_here');
    return;
  }

  console.log('[AUTH-SYNC] typeof window:', typeof window);
  console.log('[AUTH-SYNC] typeof chrome:', typeof (window as any).chrome);

  if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined') {
    console.log('[AUTH-SYNC] ✓ Window and chrome are available');
    const chromeRuntime = (window as any).chrome?.runtime;
    console.log('[AUTH-SYNC] chromeRuntime:', chromeRuntime ? 'EXISTS' : 'UNDEFINED');

    if (!chromeRuntime) {
      console.log('[AUTH-SYNC] ❌ chrome.runtime not available');
      return;
    }

    try {
      const message = token
        ? { type: 'SET_TOKEN', token }
        : { type: 'REMOVE_TOKEN' };

      console.log('[AUTH-SYNC] 📤 Sending message to extension ID:', EXTENSION_ID);
      console.log('[AUTH-SYNC] Message type:', message.type);

      // Send message with extension ID - required when calling from webpage
      chromeRuntime.sendMessage(EXTENSION_ID, message, (response: any) => {
        if (chromeRuntime.lastError) {
          console.log('[AUTH-SYNC] ⚠️ Extension not installed or not responding:', chromeRuntime.lastError.message);
        } else {
          console.log('[AUTH-SYNC] ✅ Extension acknowledged:', response);
        }
      });
    } catch (err) {
      // Extension not installed - that's okay
      console.log('[AUTH-SYNC] ❌ Error syncing with extension:', err);
    }
  } else {
    console.log('[AUTH-SYNC] ❌ Not in browser or Chrome not available');
    console.log('[AUTH-SYNC] Details - window undefined?', typeof window === 'undefined', ', chrome undefined?', typeof (window as any).chrome === 'undefined');
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
