"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          English Level Checker
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="/chat"
            className={`transition-colors ${
              pathname === "/chat"
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            会話
          </Link>
          <Link
            href="/history"
            className={`transition-colors ${
              pathname === "/history"
                ? "text-blue-600 font-medium"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            履歴
          </Link>
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            ログアウト
          </button>
        </div>
      </nav>
    </header>
  );
}
