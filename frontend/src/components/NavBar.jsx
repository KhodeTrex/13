import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const { pathname } = useLocation();
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-brand-700 font-bold text-lg">FileHub</Link>
          <div className="flex gap-3">
            <Link className={`px-3 py-1 rounded-lg ${pathname==='/'?'bg-brand-100 text-brand-700':''}`} to="/">خانه</Link>
            <Link className={`px-3 py-1 rounded-lg ${pathname==='/admin'?'bg-brand-100 text-brand-700':''}`} to="/admin">ادمین</Link>
            <Link className={`px-3 py-1 rounded-lg ${pathname==='/login'?'bg-brand-100 text-brand-700':''}`} to="/login">ورود</Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
