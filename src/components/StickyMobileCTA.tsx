'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on /register and /thanks pages so it doesn't cover the form
  const hiddenPaths = ['/register', '/thanks'];
  const shouldHide = hiddenPaths.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (shouldHide) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  if (shouldHide || !visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden">
      <div className="bg-dark-bg/95 backdrop-blur-md border-t border-white/10 px-4 pt-3 pb-6">
        <Link href="/register" className="btn-primary block w-full text-center text-base py-3.5">
          Reserve My Seat →
        </Link>
        <p className="text-center text-xs text-gray-500 mt-2">
          ⚡ Free · 60 min · Certificate included
        </p>
      </div>
    </div>
  );
}
