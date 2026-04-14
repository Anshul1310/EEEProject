import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import { useProgress } from './hooks/useProgress';
import './App.css';

function App() {
  const { 
    completedCount, 
    totalCount, 
    progressPercent, 
    markComplete, 
    isComplete 
  } = useProgress();

  return (
    <div className="app-container">
      <Navbar 
        completedCount={completedCount} 
        totalCount={totalCount}
        progressPercent={progressPercent}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage isComplete={isComplete} />} />
          <Route 
            path="/chapter/:letter" 
            element={
              <ChapterPage 
                markComplete={markComplete} 
                isComplete={isComplete} 
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
