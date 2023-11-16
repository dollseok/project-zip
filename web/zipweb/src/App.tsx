import React from 'react';
import logo from './logo.svg';
import { Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import DownloadPage from './pages/download/DownloadPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<DownloadPage/>}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
