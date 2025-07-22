import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${theme}`}>
      <ErrorBoundary>
        <Dashboard theme={theme} toggleTheme={toggleTheme} />
      </ErrorBoundary>
    </div>
  );
}

export default App;