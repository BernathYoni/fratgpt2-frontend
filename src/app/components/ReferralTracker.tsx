'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      // Store referral code for checkout
      localStorage.setItem('fratgpt_affiliate_ref', refCode);
      console.log('Affiliate tracking:', refCode);
    }
  }, [searchParams]);

  return null;
}
