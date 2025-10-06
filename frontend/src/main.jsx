import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './styles.css';
import App from './views/App.jsx';
import Login from './views/Login.jsx';
import Admin from './views/Admin.jsx';
import Public from './views/Public.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Public /> },
  { path: '/login', element: <Login /> },
  { path: '/admin', element: <App><Admin /></App> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
