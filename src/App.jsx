import React from 'react';
import { LogProvider } from './context/LogContext';
import StatusBar from './components/StatusBar';
import Sidebar from './components/Sidebar';
import LogList from './components/LogList';
import FilterBar from './components/FilterBar';

const App = () => {
  return (
    <LogProvider>
      <div className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        <div className="flex h-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <FilterBar />
            <div className="flex-1 overflow-auto">
              <LogList />
            </div>
            <StatusBar />
          </div>
        </div>
      </div>
    </LogProvider>
  );
};

export default App;
