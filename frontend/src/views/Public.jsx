import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import App from './App.jsx';

export default function Public() {
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    (async () => {
      const [cats, fs] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/files'),
      ]);
      setCategories(cats.data);
      setFiles(fs.data);
    })();
  }, []);

  return (
    <App>
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="font-bold text-brand-800 mb-3">دسته‌بندی‌ها</h2>
          <select className="input" value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
            <option value="">همه</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card md:col-span-2">
          <h2 className="font-bold text-brand-800 mb-4">فایل‌ها</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files
              .filter(f => !selectedCategory || String(f.category_id) === selectedCategory)
              .map(f => (
                <div key={f.id} className="glass rounded-xl p-4">
                  <div className="font-medium text-slate-800 truncate" title={f.original_name}>{f.original_name}</div>
                  <div className="text-xs text-slate-500 mt-1">{(f.size_bytes/1024).toFixed(1)} KB</div>
                  <a className="text-brand-700 text-sm mt-2 inline-block" href={`/api/files/${f.id}/download`} target="_blank" rel="noreferrer">دانلود</a>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </App>
  );
}
