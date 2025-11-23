'use client';

// Extension authentication callback page
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ExtensionAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting to extension...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No authentication token provided');
      return;
    }

    // Send token to extension via window.postMessage
    // The extension's content script will be listening for this
    window.postMessage({
      type: 'FRATGPT_AUTH_TOKEN',
      token: token
    }, '*');

    setStatus('success');
    setMessage('Authentication successful! Redirecting to dashboard...');

    // Redirect to dashboard after 1 second
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className={`bg-surface border ${status === 'success' ? 'border-accent' : status === 'error' ? 'border-error' : 'border-accent'} rounded-xl p-8 text-center`}>
          {/* Icon */}
          <div className="mb-6">
            {status === 'processing' && (
              <div className="mx-auto w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="mx-auto w-16 h-16 bg-error/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-3">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </h1>

          {/* Message */}
          <p className="text-text-secondary">
            {message}
          </p>

          {status === 'success' && (
            <p className="text-sm text-text-muted mt-4">
              Redirecting to dashboard...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExtensionAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    }>
      <ExtensionAuthContent />
    </Suspense>
  );
}
