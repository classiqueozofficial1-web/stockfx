import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  // Global error hook to surface uncaught errors in console during dev
  window.addEventListener('error', (ev) => console.error('Global error:', ev.error || ev.message));
  window.addEventListener('unhandledrejection', (ev) => console.error('Unhandled promise rejection:', ev.reason));
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}