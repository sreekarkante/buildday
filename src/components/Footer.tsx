import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/5 py-10">
      <div className="container-main text-center">
        <p className="text-lg font-bold gradient-text">{SITE_NAME}</p>
        <p className="text-sm text-gray-500 mt-1">A project by NxtWave</p>
        <p className="text-xs text-gray-600 mt-4">
          NSDC Partner · NASSCOM · WEF Technology Pioneer
        </p>
        <p className="text-xs text-gray-700 mt-2">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
