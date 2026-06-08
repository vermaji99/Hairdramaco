'use client';

import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, Settings, Search as SearchIcon } from 'lucide-react';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                TaskManager<span className="text-blue-600">Pro</span>
              </h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {['Dashboard', 'Projects', 'Team', 'Reports'].map((item) => (
                <button key={item} className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>

            {user && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Admin Account</span>
                </div>
                <div className="relative group">
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-10 w-10 rounded-xl border-2 border-blue-50 object-cover shadow-sm group-hover:border-blue-200 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
