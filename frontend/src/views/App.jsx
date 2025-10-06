import NavBar from '../components/NavBar.jsx';

export default function App({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100">
      <NavBar />
      <div className="pt-24">
        <div className="mx-auto max-w-6xl px-4">{children}</div>
      </div>
    </div>
  );
}
