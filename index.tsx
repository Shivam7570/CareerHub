import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import axios from 'axios';

// By making API requests relative, we avoid "Network Error" issues that can
// occur when the frontend and backend are not on the same "localhost".
// axios.defaults.baseURL = 'http://localhost:5000';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Could not find root element to mount to');
}
