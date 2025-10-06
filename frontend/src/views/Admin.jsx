import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import App from './App.jsx';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function Admin() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploading, setUploading] = useState(false);

  async function refresh() {
    const [cats, fs] = await Promise.all([
      axios.get('/api/categories'),
      axios.get('/api/files'),
    ]);
    setCategories(cats.data);
    setFiles(fs.data);
  }

  useEffect(() => { refresh(); }, []);

  async function addCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await axios.post('/api/categories', { name: newCategory }, { headers: authHeaders() });
    setNewCategory('');
    refresh();
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      if (selectedCategory) form.append('categoryId', selectedCategory);
      await axios.post('/api/files/upload', form, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } });
      refresh();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <App>
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="font-bold text-brand-800 mb-3">دسته‌بندی‌ها</h2>
          <form onSubmit={addCategory} className="flex gap-2">
            <input className="input" value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="نام دسته" />
            <button className="button" type="submit">ایجاد</button>
          </form>
          <ul className="mt-4 space-y-1">
            {categories.map(c => (
              <li key={c.id} className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                <span>{c.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-800">فایل‌ها</h2>
            <div className="flex gap-2 items-center">
              <select className="input w-48" value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
                <option value="">همه</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="button cursor-pointer">
                {uploading ? 'در حال آپلود...' : 'آپلود فایل'}
                <input type="file" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>
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
