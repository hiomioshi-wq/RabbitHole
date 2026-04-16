import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("Rabbit Hole: Initializing...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Rabbit Hole: Root element not found!");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Rabbit Hole: Mounted successfully.");
} catch (e) {
  console.error("Rabbit Hole: Mount failed", e);
  rootElement.innerHTML = `<div style="color:red; padding:20px;"><h3>Application Crashed</h3><pre>${e instanceof Error ? e.message : 'Unknown error'}</pre></div>`;
}
