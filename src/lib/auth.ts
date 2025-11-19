// Client-side auth utilities

// Extension ID - will be set once extension is published
// For now, users need to load unpacked extension and it will work with externally_connectable
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || ''; // Add this to .env once published

// Sync token with Chrome extension
function syncTokenWithExtension(token: string | null) {
  if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined') {
    const chromeRuntime = (window as any).chrome?.runtime;
    if (!chromeRuntime) return;

    try {
      const message = token
        ? { type: 'SET_TOKEN', token }
        : { type: 'REMOVE_TOKEN' };

      // Try to send to extension
      if (EXTENSION_ID) {
        // Published extension with known ID
        chromeRuntime.sendMessage(EXTENSION_ID, message, (response: any) => {
          if (chromeRuntime.lastError) {
            console.log('Extension not available for sync');
          }
        });
      } else {
        // Unpacked extension - externally_connectable handles this
        chromeRuntime.sendMessage(message, (response: any) => {
          if (chromeRuntime.lastError) {
            console.log('Extension not available for sync');
          }
        });
      }
    } catch (err) {
      // Extension not installed - that's okay
      console.log('Extension not available');
    }
  }
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    console.log('[AUTH] 🔐 Saving token:', token.substring(0, 20) + '...');
    localStorage.setItem('authToken', token);
    console.log('[AUTH] ✓ Token saved to localStorage');

    // Sync with extension
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
