import { useNavigate } from 'react-router-dom';
import aslAlphabet from '../data/aslAlphabet';
import { BookOpen, Video, TrendingUp, BookMarked } from 'lucide-react';
import aboutImage from '../images/diverse-people-show-sign-language-signs-vector.jpg';

export default function HomePage({ isComplete }) {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="home-hero">
        <h1>Learn Sign Language<br />One Letter at a Time</h1>
        <p>
          Master the <span className="highlight">American Sign Language (ASL)</span> alphabet 
          with interactive lessons and real-time hand detection. 
          Practice each letter and track your progress.
        </p>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>About SignLingo</h2>
          <p>
            SignLingo is an educational tool designed to help you learn the American Sign Language alphabet through interactive practice. 
            Using your webcam and advanced hand detection technology, you can practice signing each letter and receive instant feedback.
          </p>
          <p>
            This project was created as part of a college course to demonstrate the integration of computer vision and web technologies 
            for accessible education.
          </p>
        </div>
        <div className="about-image-container">
          <img src={aboutImage} alt="People signing in American Sign Language" className="about-image" />
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <Video size={32} />
            </div>
            <h3>Real-time Detection</h3>
            <p>Use your camera to practice signs with immediate feedback on accuracy.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <TrendingUp size={32} />
            </div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with completion status for each letter.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <BookMarked size={32} />
            </div>
            <h3>Step-by-Step Instructions</h3>
            <p>Detailed guides for forming each ASL letter correctly.</p>
          </div>
        </div>
      </section>

      <section className="chapters-section">
        <h2 className="chapters-section-title">
          <BookOpen size={24} style={{ marginRight: '8px' }} />
          Alphabet Chapters
        </h2>
        
        <div className="chapter-grid" id="chapter-grid">
          {aslAlphabet.map((chapter, index) => {
            const done = isComplete(chapter.letter);
            return (
              <div
                key={chapter.letter}
                className={`chapter-card ${done ? 'completed' : ''}`}
                onClick={() => navigate(`/chapter/${chapter.letter}`)}
                style={{ animationDelay: `${index * 0.03}s` }}
                id={`chapter-card-${chapter.letter}`}
              >
                <div className="chapter-card-letter">{chapter.letter}</div>
                <div className="chapter-card-name">{chapter.name}</div>
                <div className={`chapter-card-status ${done ? 'done' : 'pending'}`}>
                  {done ? (
                    <>
                      <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Completed
                    </>
                  ) : (
                    <>○ Not started</>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
