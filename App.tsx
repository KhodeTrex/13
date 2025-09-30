
import React, { useState, useCallback, useEffect, Dispatch, SetStateAction } from 'react';
import { UserRole, Category, Flowchart, NewsItem } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { PlusIcon, XIcon, UploadIcon } from './components/icons';

// --- MOCK DATA (for initial load if localStorage is empty) ---
const initialCategories: Category[] = [
  { id: 'cat1', name: 'استخدام' },
  { id: 'cat2', name: 'فرآیند فروش' },
  { id: 'cat3', name: 'پشتیبانی مشتریان' },
];

const placeholder1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzFlMjkzYjsiPjxzdHlsZT4ucmVjdHtmaWxsOiMzMzQxNTU7c3Ryb2tlOiM0NzU1Njltc3Ryb2tlLXdpZHRoOjI7fS50ZXh0e2ZvbnQtZmFtaWx5OidWYXppcm1hdG4nLHNhbnMtc2VyaWY7ZmlsbDojOTRhM2I4O2ZvbnQtc2l6ZToxNnB4O3RleHQtYW5jaG9yOm1pZGRsZTt9LmxpbmV7c3Ryb2tlOiM0NzU1Njk7c3Ryb2tlLXdpZHRoOjI7bWFya2VyLWVuZDp1cmwoI2Fycm93KTt9PC9zdHlsZT48ZGVmcz48bWFya2VyIGlkPSJhcnJvdyIgdmlld0JveD0iMCAwIDEwIDEwIiByZWZYPSI1IiByZWZZPSI1IiBtYXJrZXJXaWR0aD0iNiIgbWFya2VySGVpZ2h0PSI2IiBvcmllbnQ9ImF1dG8tc3RhcnQtcmV2ZXJzZSI+PHBhdGggZD0iTSAwIDAgTCAxMCA1IEwgMCAxMCB6IiBmaWxsPSIjNDc1NTY5IiAvPjwvbWFya2VyPjwvZGVmcz48cmVjdCB4PSIxNTAiIHk9IjUwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiByeD0iMTAiIGNsYXNzPSJyZWN0IiAvPjx0ZXh0IHg9IjIwMCIgeT0iODUiIGNsYXNzPSJ0ZXh0Ij7Yr9in2LHYpzwvdGV4dD48bGluZSB4MT0iMjAwIiB5MT0iMTEwIiB4Mj0iMjAwIiB5Mj0iMTUwIiBjbGFzcz0ibGluZSIgLz48cmVjdCB4PSIxMjUiIHk9IjE3MCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSI2MCIgcng9IjEwIiBjbGFzcz0icmVjdCIgLz48dGV4dCB4PSIyMDAiIHk9IjIwNSIgY2xhc3M9InRleHQiPtmE2K/Yp9mG2Yc8L3RleHQ+PC9zdmc+";
const placeholder2 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzFlMjkzYjsiPjxzdHlsZT4uc2hhcGV7ZmlsbDojMGYxNzJhO3N0cm9rZTojMzhiZGY4O3N0cm9rZS1widthOjI7fS50ZXh0e2ZvbnQtZmFtaWx5OidWYXppcm1hdG4nLHNhbnMtc2VyaWY7ZmlsbDojN2RkM2ZjO2ZvbnQtc2l6ZToxNnB4O3RleHQtYW5jaG9yOm1pZGRsZTt9LmxpbmV7c3Ryb2tlOiMzOGJkZjg7c3Ryb2tlLXdpZHRoOjI7bWFya2VyLWVuZDp1cmwoI2Fycm93KTt9PC9zdHlsZT48ZGVmcz48bWFya2VyIGlkPSJhcnJvdyIgdmlld0JveD0iMCAwIDEwIDEwIiByZWZYPSI1IiByZWZZPSI1IiBtYXJrZXJXaWR0aD0iNiIgbWFya2VySGVpZ2h0PSI2IiBvcmllbnQ9ImF1dG8tc3RhcnQtcmV2ZXJzZSI+PHBhdGggZD0iTSAwIDAgTCAxMCA1IEwgMCAxMCB6IiBmaWxsPSIjMzhiZGY4IiAvPjwvbWFya2VyPjwvZGVmcz48cGF0aCBkPSJNMTUwIDcwIEwyMDAgMjAgTDI1MCA3MCBMMjAwIDEyMCBaIiBjbGFzcz0ic2hhcGUiIC8+PHRleHQgeD0iMjAwIiB5PSI3NSIgY2xhc3M9InRleHQiPtiq2YHZhdi52KfYpzwvdGV4dD48bGluZSB4MT0iMjAwIiB5MT0iMTIwIiB4Mj0iMjAwIiB5Mj0iMTcwIiBjbGFzcz0ibGluZSIgLz48cmVjdCB4PSIxMjUiIHk9IjE3MCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSI2MCIgcng9IjEwIiBjbGFzcz0ic2hhcGUiIC8+PHRleHQgeD0iMjAwIiB5PSIyMDUiIGNsYXNzPSJ0ZXh0Ij7Yp9i62K/Yp9mGPC90ZXh0Pjwvc3ZnPg==";
const placeholder3 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IzFlMjkzYjsiPjxzdHlsZT4uc2hhcGV7ZmlsbDojMzM0MTU1O3N0cm9rZTojYTc4YmZhO3N0cm9rZS13aWR0aDoyO30udGV4dHtmb250LWZhbWlseTonVmF6aXJtYXRuJyBzYW5zLXNlcmlmO2ZpbGw6I2M0YjVmZDtmb250LXNpemU6MTZweDt0ZXh0LWFuY2hvcjptaWRkbGU7fS5saW5le3N0cm9rZTojYTc4YmZhO3N0cm9rZS13aWR0aDoyO21hcmtlci1lbmQ6dXJsKCNhcnJvdyk7fTwvc3R5bGU+PGRlZnM+PG1hcmtlciBpZD0iYXJyb3ciIHZpZXdCb3g9IjAgMCAxMCAxMCIgcmVmWD0iNSIgcmVmWT0iNSIgbWFya2VyV2lkdGg9IjYiIG1hcmtlckhlaWdodD0iNiIgb3JpZW50PSJhdXRvLXN0YXJ0LXJldmVyc2UiPjxwYXRoIGQ9Ik0gMCAwIEwgMTAgNSBMIDAgMTAgeiIgZmlsbD0iI2E3OGJmYSIgLz48L21hcmtlcj48L2RlZnM+PHJlY3QgeD0iMTI1IiB5PSI0MCIgd2lkdGg9IjE1MCIgaGVpZ2h0PSI2MCIgcng9IjEwIiBjbGFzcz0ic2hhcGUiIC8+PHRleHQgeD0iMjAwIiB5PSI3NSIgY2xhc3M9InRleHQiPty22K/Yp9mB2Icg2KjYp9mFPC90ZXh0PjxsaW5lIHgxPSIyMDAiIHkxPSIxMDAiIHgyPSIyMDAiIHkyPSIxNTAiIGNsYXNzPSJsaW5lIiAvPjxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxOTAiIHJ4PSI4MCIgcnk9IjQwIiBjbGFzcz0ic2hhcGUiIC8+PHRleHQgeD0iMjAwIiB5PSIxOTUiIGNsYXNzPSJ0ZXh0Ij7YvdmF2KfYsTwvdGV4dD48L3N2Zz4=";

const initialFlowcharts: Flowchart[] = [
  { id: 'flow1', title: 'آنبوردینگ کارمند جدید', description: 'فرآیند گام به گام برای جذب نیروهای جدید.', categoryId: 'cat1', imageUrl: placeholder1 },
  { id: 'flow2', title: 'بررسی صلاحیت مشتری', description: 'چگونگی ارزیابی مشتریان بالقوه فروش.', categoryId: 'cat2', imageUrl: placeholder2 },
  { id: 'flow3', title: 'فرآیند پشتیبانی سطح ۱', description: 'مراحل اولیه عیب‌یابی مشکلات مشتریان.', categoryId: 'cat3', imageUrl: placeholder3 },
  { id: 'flow4', title: 'مراحل قیف فروش', description: 'نمایش تصویری سفر مشتری.', categoryId: 'cat2', imageUrl: placeholder2 },
];

const initialNews: NewsItem[] = [
  { id: 'news1', title: 'بروزرسانی سیستم نسخه ۱.۱', content: 'رابط کاربری با طراحی شیشه‌ای جدید و بهبود عملکرد بروزرسانی شد. مدیران اکنون می‌توانند دسته‌بندی‌ها را مستقیماً از نوار کناری اضافه کنند.', date: '2024-07-29' },
  { id: 'news2', title: 'به تراز حساب خوش آمدید!', content: 'این پلتفرم برای کمک به شما در تصویرسازی و مدیریت تمام فرآیندها و فلوچارت‌های کسب و کارتان در یک مکان طراحی شده است.', date: '2024-07-28' },
];

// --- HOOK FOR LOCALSTORAGE PERSISTENCE ---
function useStickyState<T>(defaultValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}


// --- MODAL COMPONENT ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-lg shadow-xl w-full max-w-lg m-4 text-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- FORM COMPONENTS (defined outside App to prevent re-renders) ---

const buttonBaseClasses = "w-full backdrop-blur-sm border text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 disabled:cursor-not-allowed";
const primaryButtonClasses = `${buttonBaseClasses} bg-blue-600/60 border-blue-500/50 hover:bg-blue-500/80 hover:border-blue-400 disabled:bg-slate-600/50 disabled:border-slate-500/50`;

const AddCategoryForm: React.FC<{ onSubmit: (name: string) => void }> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="catName" className="block text-sm font-medium text-slate-300 mb-1">نام دسته‌بندی</label>
        <input type="text" id="catName" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" />
      </div>
      <button type="submit" className={primaryButtonClasses}>افزودن دسته‌بندی</button>
    </form>
  );
};

const AddNewsForm: React.FC<{ onSubmit: (title: string, content: string) => void }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    setTitle('');
    setContent('');
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="newsTitle" className="block text-sm font-medium text-slate-300 mb-1">عنوان</label>
        <input type="text" id="newsTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="newsContent" className="block text-sm font-medium text-slate-300 mb-1">محتوا</label>
        <textarea id="newsContent" value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" />
      </div>
      <button type="submit" className={primaryButtonClasses}>انتشار خبر</button>
    </form>
  );
};

interface AddFlowchartFormProps {
  onSubmit: (title: string, description: string, categoryId: string, imageUrl: string) => void;
  categories: Category[];
}

const AddFlowchartForm: React.FC<AddFlowchartFormProps> = ({ onSubmit, categories }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(imageUrl) {
      onSubmit(title, description, categoryId, imageUrl);
      setTitle('');
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setImageUrl(null);
      setFileName(null);
    }
  };
  
  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="flowTitle" className="block text-sm font-medium text-slate-300 mb-1">عنوان</label>
          <input type="text" id="flowTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="flowDesc" className="block text-sm font-medium text-slate-300 mb-1">توضیحات</label>
          <textarea id="flowDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="flowCat" className="block text-sm font-medium text-slate-300 mb-1">دسته‌بندی</label>
          <select id="flowCat" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">تصویر فلوچارت</label>
            {!imageUrl ? (
                <div className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-slate-600 border-dashed rounded-md hover:bg-slate-700/50 transition-colors relative">
                     <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                     <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                     <span className="mt-2 block text-sm font-medium text-blue-400">
                         برای انتخاب کلیک کنید یا فایل را بکشید
                     </span>
                     <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF, SVG</p>
                </div>
            ) : (
                 <div className="mt-2 p-3 border border-slate-600 rounded-md bg-slate-700/30 flex items-center justify-between">
                    <div className='flex items-center gap-3 overflow-hidden'>
                        <img src={imageUrl} alt="preview" className="h-10 w-10 object-cover rounded"/>
                        <p className="text-sm text-slate-200 truncate">{fileName}</p>
                    </div>
                    <button type="button" onClick={() => { setImageUrl(null); setFileName(null);}} className="p-1 text-slate-400 hover:text-white flex-shrink-0">
                        <XIcon className="h-5 w-5"/>
                    </button>
                </div>
            )}
        </div>
        <button type="submit" className={primaryButtonClasses} disabled={!imageUrl || !title || !description}>افزودن فلوچارت</button>
      </form>
  );
};


// --- APP COMPONENT ---

function App() {
  const [categories, setCategories] = useStickyState<Category[]>(initialCategories, 'taraz-hesab-categories');
  const [flowcharts, setFlowcharts] = useStickyState<Flowchart[]>(initialFlowcharts, 'taraz-hesab-flowcharts');
  const [news, setNews] = useStickyState<NewsItem[]>(initialNews, 'taraz-hesab-news');
  const [adminPassword, setAdminPassword] = useStickyState<string>('admin123', 'taraz-hesab-password');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = isLoggedIn ? UserRole.ADMIN : UserRole.VIEWER;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  const handleLogin = useCallback(() => {
    const pass = prompt('لطفا رمز عبور مدیر را وارد کنید:');
    if (pass === adminPassword) {
      setIsLoggedIn(true);
    } else if (pass) {
      alert('رمز عبور اشتباه است.');
    }
  }, [adminPassword]);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const handleChangePassword = useCallback(() => {
    const oldPass = prompt('لطفا رمز عبور فعلی را وارد کنید:');
    if (oldPass !== adminPassword) {
      if(oldPass) alert('رمز عبور فعلی اشتباه است.');
      return;
    }
    const newPass = prompt('لطفا رمز عبور جدید را وارد کنید:');
    if (newPass && newPass.length >= 6) {
      setAdminPassword(newPass);
      alert('رمز عبور با موفقیت تغییر کرد.');
    } else if (newPass) {
      alert('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
    }
  }, [adminPassword, setAdminPassword]);


  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [activeView, setActiveView] = useState<'flowcharts' | 'news'>('flowcharts');
  
  const [isAddFlowchartModalOpen, setAddFlowchartModalOpen] = useState(false);
  const [isAddNewsModalOpen, setAddNewsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  const handleAddCategory = useCallback((name: string) => {
    if (name.trim()) {
      const newCategory: Category = { id: `cat${Date.now()}`, name };
      setCategories(prev => [...prev, newCategory]);
      setAddCategoryModalOpen(false);
    }
  }, [setCategories]);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    const isCategoryInUse = flowcharts.some(f => f.categoryId === categoryId);
    if (isCategoryInUse) {
      alert('این دسته‌بندی خالی نیست و نمی‌توان آن را حذف کرد. ابتدا فلوچارت‌های داخل آن را حذف یا جابجا کنید.');
      return;
    }

    if (window.confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      if (selectedCategory === categoryId) {
        setSelectedCategory('all');
      }
    }
  }, [flowcharts, selectedCategory, setCategories]);

  const handleDeleteFlowchart = useCallback((flowchartId: string) => {
    if (window.confirm('آیا از حذف این فلوچارت اطمینان دارید؟')) {
      setFlowcharts(prev => prev.filter(f => f.id !== flowchartId));
    }
  }, [setFlowcharts]);


  const handleAddNews = useCallback((title: string, content: string) => {
    if (title.trim() && content.trim()) {
      const newNewsItem: NewsItem = {
        id: `news${Date.now()}`,
        title,
        content,
        date: new Date().toISOString().split('T')[0],
      };
      setNews(prev => [newNewsItem, ...prev]);
      setAddNewsModalOpen(false);
    }
  }, [setNews]);

  const handleAddFlowchart = useCallback((title: string, description: string, categoryId: string, imageUrl: string) => {
    if (title.trim() && description.trim() && categoryId && imageUrl.trim()) {
      const newFlowchart: Flowchart = {
        id: `flow${Date.now()}`,
        title,
        description,
        categoryId,
        imageUrl,
      };
      setFlowcharts(prev => [newFlowchart, ...prev]);
      setAddFlowchartModalOpen(false);
    }
  }, [setFlowcharts]);


  return (
    <div className="min-h-screen bg-slate-900 bg-gradient-to-bl from-slate-900 via-blue-900/20 to-slate-900">
      <Header 
        userRole={userRole}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onChangePassword={handleChangePassword}
        isLoaded={isLoaded}
      />
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        onAddCategory={() => setAddCategoryModalOpen(true)}
        onDeleteCategory={handleDeleteCategory}
        isLoaded={isLoaded}
      />
      <MainContent
        activeView={activeView}
        flowcharts={flowcharts}
        news={news}
        categories={categories}
        selectedCategory={selectedCategory}
        userRole={userRole}
        onDeleteFlowchart={handleDeleteFlowchart}
        isLoaded={isLoaded}
      />

      <div className={`fixed bottom-8 left-8 z-30 flex flex-col space-y-3 transition-all duration-500 ease-out delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {userRole === UserRole.ADMIN && (
          <>
            <button onClick={() => setAddFlowchartModalOpen(true)} className="flex items-center justify-start gap-3 w-max bg-blue-600/50 backdrop-blur-md border border-blue-500/50 text-white rounded-full py-3 px-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 hover:bg-blue-500/70 hover:border-blue-400">
              <PlusIcon className="h-6 w-6" />
              <span className="font-semibold pr-2">افزودن فلوچارت</span>
            </button>
            <button onClick={() => setAddNewsModalOpen(true)} className="flex items-center justify-start gap-3 w-max bg-teal-600/50 backdrop-blur-md border border-teal-500/50 text-white rounded-full py-3 px-4 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-teal-500/30 hover:bg-teal-500/70 hover:border-teal-400">
              <PlusIcon className="h-6 w-6" />
              <span className="font-semibold pr-2">افزودن خبر</span>
            </button>
          </>
        )}
      </div>

      <Modal isOpen={isAddCategoryModalOpen} onClose={() => setAddCategoryModalOpen(false)} title="افزودن دسته‌بندی جدید">
        <AddCategoryForm onSubmit={handleAddCategory} />
      </Modal>
      
      <Modal isOpen={isAddNewsModalOpen} onClose={() => setAddNewsModalOpen(false)} title="افزودن خبر جدید">
        <AddNewsForm onSubmit={handleAddNews} />
      </Modal>
      
      <Modal isOpen={isAddFlowchartModalOpen} onClose={() => setAddFlowchartModalOpen(false)} title="افزودن فلوچارت جدید">
        <AddFlowchartForm onSubmit={handleAddFlowchart} categories={categories} />
      </Modal>

    </div>
  );
}

export default App;