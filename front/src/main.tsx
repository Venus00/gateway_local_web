import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './features/auth/store.ts';

// const body = document.body;
// const theme = localStorage.getItem("theme") || "light";
// body.classList.add(theme);


createRoot(document.getElementById('root')!).render(
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
)
