import React from 'react';
import { UserRole } from '../types';
import { LoginIcon, LogoutIcon, KeyIcon } from './icons';

interface HeaderProps {
  userRole: UserRole;
  onLogin: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
  isLoaded: boolean;
}

const Header: React.FC<HeaderProps> = ({ userRole, onLogin, onLogout, onChangePassword, isLoaded }) => {
  const buttonClasses = "flex items-center justify-center p-2 rounded-full text-slate-300 bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 shadow-md hover:bg-slate-700/70 hover:border-slate-500/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200";

  return (
    <header className={`fixed top-0 left-0 right-0 z-20 bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 shadow-lg transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              تراز حساب
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === UserRole.ADMIN ? (
              <>
                <button
                  onClick={onChangePassword}
                  className={buttonClasses}
                  aria-label="تغییر رمز عبور"
                >
                  <KeyIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onLogout}
                  className={buttonClasses}
                  aria-label="خروج از حساب"
                >
                  <LogoutIcon className="h-5 w-5" />
                </button>
                 <span className="mr-4 text-sm font-medium text-teal-400">
                    حالت مدیر
                 </span>
              </>
            ) : (
               <>
                <button
                  onClick={onLogin}
                  className="flex items-center justify-center gap-2 pr-3 pl-4 py-2 rounded-full text-slate-200 bg-slate-700/40 backdrop-blur-sm border border-slate-600/50 shadow-md hover:bg-slate-700/70 hover:border-slate-500/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-200"
                  aria-label="ورود مدیر"
                >
                  <LoginIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold">ورود مدیر</span>
                </button>
                 <span className="mr-4 text-sm font-medium text-blue-400">
                    حالت مشاهده‌گر
                 </span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;