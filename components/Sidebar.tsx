import React from 'react';
import { Category, UserRole } from '../types';
import { ChartBarIcon, NewsIcon, PlusIcon, TrashIcon } from './icons';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  activeView: 'flowcharts' | 'news';
  setActiveView: (view: 'flowcharts' | 'news') => void;
  userRole: UserRole;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  isLoaded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  activeView,
  setActiveView,
  userRole,
  onAddCategory,
  onDeleteCategory,
  isLoaded,
}) => {
  const navItemClasses = (view: 'flowcharts' | 'news') =>
    `flex items-center w-full px-4 py-3 text-right text-sm font-medium rounded-lg transition-all duration-200 ${
      activeView === view
        ? 'bg-blue-500/20 text-blue-300 backdrop-blur-sm border border-blue-500/30 shadow-md'
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;

  const categoryItemClasses = (id: string | null) =>
    `w-full px-4 py-2 text-right text-sm rounded-md transition-colors duration-200 ${
      selectedCategory === id
        ? 'bg-slate-700 font-semibold text-white'
        : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
    }`;

  return (
    <aside className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-slate-800/50 backdrop-blur-lg border-l border-slate-700/50 p-4 flex flex-col transition-all duration-500 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
      <nav className="space-y-2">
        <button onClick={() => setActiveView('flowcharts')} className={navItemClasses('flowcharts')}>
          <ChartBarIcon className="h-5 w-5 ml-3" />
          فلوچارت‌ها
        </button>
        <button onClick={() => setActiveView('news')} className={navItemClasses('news')}>
          <NewsIcon className="h-5 w-5 ml-3" />
          اخبار
        </button>
      </nav>
      {activeView === 'flowcharts' && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">دسته‌بندی‌ها</h3>
            {userRole === UserRole.ADMIN && (
              <button onClick={onAddCategory} className="p-1 text-slate-300 bg-slate-700/40 hover:bg-slate-700/70 border border-slate-600/50 rounded-full transition-all duration-200">
                <PlusIcon className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="space-y-1">
            <button onClick={() => setSelectedCategory('all')} className={categoryItemClasses('all')}>
              همه
            </button>
            {categories.map((category) => (
              <div key={category.id} className="group relative flex items-center">
                <button onClick={() => setSelectedCategory(category.id)} className={categoryItemClasses(category.id)}>
                  {category.name}
                </button>
                {userRole === UserRole.ADMIN && (
                  <button 
                    onClick={() => onDeleteCategory(category.id)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label={`حذف دسته‌بندی ${category.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;