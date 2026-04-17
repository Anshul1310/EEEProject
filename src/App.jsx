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
      <footer className="app-footer">
        <p>&copy; 2026 SignLingo - Navratna. Built with React and MediaPipe.</p>
        <p>Learn more about ASL at <a href="https://www.lifeprint.com/" target="_blank" rel="noopener noreferrer">Lifeprint</a>.</p>
      </footer>
    </div>
  );
}

export default App;
