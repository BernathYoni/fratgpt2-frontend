// Client-side auth utilities

// Extension ID - will be set once extension is published
// For now, users need to load unpacked extension and it will work with externally_connectable
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || ''; // Add this to .env once published

// Sync token with Chrome extension
function syncTokenWithExtension(token: string | null) {
  if (typeof window !== 'undefined' && typeof chrome !== 'undefined' && chrome.runtime) {
    try {
      const message = token
        ? { type: 'SET_TOKEN', token }
        : { type: 'REMOVE_TOKEN' };

      // Try to send to extension
      if (EXTENSION_ID) {
        // Published extension with known ID
        chrome.runtime.sendMessage(EXTENSION_ID, message, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension not available for sync');
          }
        });
      } else {
        // Unpacked extension - externally_connectable handles this
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
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
    localStorage.setItem('authToken', token);
    // Sync with extension
    syncTokenWithExtension(token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('cachedUser');
    // Sync logout with extension
    syncTokenWithExtension(null);
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
