import React from 'react';
import { Flowchart, NewsItem, Category, UserRole } from '../types';
import { TrashIcon, EditIcon } from './icons';

// Helper: Flowchart Card Component
interface FlowchartCardProps {
  flowchart: Flowchart;
  categoryName: string;
  userRole: UserRole;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
const FlowchartCard: React.FC<FlowchartCardProps> = ({ flowchart, categoryName, userRole, onDelete, onEdit }) => (
  <div className="relative group bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:border-slate-600 hover:-translate-y-1">
    {userRole === UserRole.ADMIN && (
       <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-200 opacity-0 group-hover:opacity-100">
        <button 
          onClick={() => onEdit(flowchart.id)}
          className="p-1.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-400 hover:bg-blue-500/50 hover:text-white transition-all"
          aria-label={`ویرایش فلوچارت ${flowchart.title}`}
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(flowchart.id)}
          className="p-1.5 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-full text-slate-400 hover:bg-red-500/50 hover:text-white transition-all"
          aria-label={`حذف فلوچارت ${flowchart.title}`}
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    )}
    <img className="w-full h-48 object-cover" src={flowchart.imageUrl} alt={flowchart.title} />
    <div className="p-5">
      <span className="text-xs font-semibold text-blue-400 uppercase">{categoryName}</span>
      <h3 className="text-lg font-bold mt-1 text-slate-100">{flowchart.title}</h3>
      <p className="text-sm text-slate-400 mt-2">{flowchart.description}</p>
    </div>
  </div>
);

// Helper: News Card Component
interface NewsCardProps {
  newsItem: NewsItem;
}
const NewsCard: React.FC<NewsCardProps> = ({ newsItem }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-teal-500/10 hover:border-slate-600">
        <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-bold text-slate-100">{newsItem.title}</h3>
            <span className="text-xs text-slate-500">{new Date(newsItem.date).toLocaleDateString('fa-IR')}</span>
        </div>
        <p className="text-slate-300 mt-4">{newsItem.content}</p>
    </div>
);


interface MainContentProps {
  activeView: 'flowcharts' | 'news';
  flowcharts: Flowchart[];
  news: NewsItem[];
  categories: Category[];
  selectedCategory: string | null;
  userRole: UserRole;
  onDeleteFlowchart: (id: string) => void;
  onEditFlowchart: (id: string) => void;
  isLoaded: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  activeView,
  flowcharts,
  news,
  categories,
  selectedCategory,
  userRole,
  onDeleteFlowchart,
  onEditFlowchart,
  isLoaded,
}) => {
  const filteredFlowcharts = selectedCategory === 'all'
    ? flowcharts
    : flowcharts.filter(f => f.categoryId === selectedCategory);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'بدون دسته‌بندی';
  
  const selectedCategoryName = selectedCategory === 'all' ? 'همه' : categories.find(c => c.id === selectedCategory)?.name || '';

  return (
    <main className={`pr-64 pt-16 min-h-screen transition-all duration-500 ease-out delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="p-8">
            {activeView === 'flowcharts' && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-slate-100">فلوچارت‌ها <span className="text-blue-400">&gt; {selectedCategoryName}</span></h2>
                    {filteredFlowcharts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredFlowcharts.map((flowchart) => (
                                <FlowchartCard 
                                    key={flowchart.id} 
                                    flowchart={flowchart} 
                                    categoryName={getCategoryName(flowchart.categoryId)} 
                                    userRole={userRole}
                                    onDelete={onDeleteFlowchart}
                                    onEdit={onEditFlowchart}
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16 text-slate-500">
                            <p>هیچ فلوچارتی در این دسته‌بندی یافت نشد.</p>
                        </div>
                    )}
                </div>
            )}
            {activeView === 'news' && (
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-slate-100">آخرین اخبار</h2>
                    <div className="space-y-6">
                        {news.map((item) => (
                            <NewsCard key={item.id} newsItem={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    </main>
  );
};

export default MainContent;