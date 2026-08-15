// Ensure global fetch has writable setter across all execution targets
(function ensureFetchSetter() {
  try {
    if (typeof window !== 'undefined' && window.fetch) {
      const orig = window.fetch.bind(window);
      let current = orig;
      const targets = [
        typeof Window !== 'undefined' ? Window.prototype : null,
        typeof window !== 'undefined' ? window : null,
        typeof globalThis !== 'undefined' ? globalThis : null,
        typeof self !== 'undefined' ? self : null,
      ].filter(Boolean);

      for (const target of targets) {
        try {
          Object.defineProperty(target, 'fetch', {
            get: () => current,
            set: (val: typeof window.fetch) => {
              current = val;
            },
            configurable: true,
            enumerable: true,
          });
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
