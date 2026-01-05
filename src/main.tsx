import React from 'react';
import ReactDOM from 'react-dom/client';
import AppProgress from './App.progress'; // Use progressive version
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProgress />
  </React.StrictMode>
);