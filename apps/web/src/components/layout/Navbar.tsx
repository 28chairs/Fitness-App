'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Fitness Platform
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/communities" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                Communities
              </Link>
              <Link href="/events" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                Events
              </Link>
              <Link href="/leaderboards" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                Leaderboards
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

