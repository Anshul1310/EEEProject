import { useNavigate } from 'react-router-dom';
import aslAlphabet from '../data/aslAlphabet';

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

      <section className="chapters-section">
        <h2 className="chapters-section-title">
          📚 Alphabet Chapters
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
