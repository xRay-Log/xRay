import React from 'react';
import { LogProvider } from './context/LogContext';
import StatusBar from './components/StatusBar';
import Sidebar from './components/Sidebar';
import LogList from './components/LogList';
import FilterBar from './components/FilterBar';

function App() {
  return (
    <LogProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <FilterBar />
          <div className="flex-1 overflow-auto">
            <LogList />
          </div>
          <StatusBar />
        </div>
      </div>
    </LogProvider>
  );
}

export default App;
