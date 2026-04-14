import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import aslAlphabet from '../data/aslAlphabet';
import { useHandDetection } from '../hooks/useHandDetection';

export default function ChapterPage({ markComplete, isComplete }) {
  const { letter } = useParams();
  const navigate = useNavigate();
  const chapter = aslAlphabet.find(c => c.letter === letter?.toUpperCase());
  
  const {
    videoRef,
    canvasRef,
    isLoading,
    isCameraActive,
    detectedLetter,
    error,
    confidence,
    startCamera,
    stopCamera,
    resetDetection,
  } = useHandDetection();

  const [showComplete, setShowComplete] = useState(false);
  const [hasBeenCorrect, setHasBeenCorrect] = useState(false);
  const completed = isComplete(chapter?.letter);

  // Check for correct detection
  useEffect(() => {
    if (detectedLetter && chapter && detectedLetter === chapter.letter && !hasBeenCorrect) {
      setHasBeenCorrect(true);
      // Mark as complete after a short celebration delay
      setTimeout(() => {
        markComplete(chapter.letter);
        setShowComplete(true);
      }, 1000);
    }
  }, [detectedLetter, chapter, hasBeenCorrect, markComplete]);

  // Reset state when letter changes
  useEffect(() => {
    setHasBeenCorrect(false);
    setShowComplete(false);
    resetDetection();
  }, [letter, resetDetection]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  if (!chapter) {
    return (
      <div className="chapter-page">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h1>Chapter not found</h1>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = aslAlphabet.findIndex(c => c.letter === chapter.letter);
  const prevChapter = currentIndex > 0 ? aslAlphabet[currentIndex - 1] : null;
  const nextChapter = currentIndex < aslAlphabet.length - 1 ? aslAlphabet[currentIndex + 1] : null;

  const getDetectionStatus = () => {
    if (!isCameraActive) return 'idle';
    if (hasBeenCorrect || detectedLetter === chapter.letter) return 'correct';
    if (detectedLetter && detectedLetter !== chapter.letter) return 'incorrect';
    if (confidence > 0) return 'detecting';
    return 'idle';
  };

  const getStatusText = () => {
    const status = getDetectionStatus();
    switch (status) {
      case 'correct':
        return `✅ Correct! You signed "${chapter.letter}" perfectly!`;
      case 'incorrect':
        return `Detected: "${detectedLetter}" — Keep trying for "${chapter.letter}"`;
      case 'detecting':
        return `🔍 Analyzing your hand sign... (${Math.round(confidence * 100)}%)`;
      default:
        return isCameraActive ? '👋 Show your hand sign to the camera' : 'Start the camera to begin practicing';
    }
  };

  const difficultyColors = {
    easy: '#00e676',
    medium: '#ffab40',
    hard: '#ff5252'
  };

  return (
    <div className="chapter-page">
      {/* Header */}
      <div className="chapter-header">
        <button className="back-btn" onClick={() => navigate('/')} id="back-button">
          ← Back
        </button>
        <div className="chapter-title-group">
          <h1>Chapter: Letter {chapter.letter}</h1>
          <div className="chapter-subtitle">
            <span style={{ color: difficultyColors[chapter.difficulty] }}>
              ● {chapter.difficulty.charAt(0).toUpperCase() + chapter.difficulty.slice(1)}
            </span>
            {completed && <span style={{ color: 'var(--success)', marginLeft: '1rem' }}>✓ Completed</span>}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="chapter-content">
        {/* Instructions Panel */}
        <div className="instructions-panel" id="instructions-panel">
          <h2>📖 How to Sign</h2>
          
          <div className="sign-display">
            <div className="sign-letter-large">{chapter.letter}</div>
            <div className="sign-image-container">
              <img 
                src="/asl-reference.png" 
                alt={`ASL alphabet reference chart`}
                style={{ objectFit: 'contain', padding: '8px' }}
              />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
              📌 ASL Alphabet Reference Chart
            </p>
          </div>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '0.95rem' }}>
            {chapter.description}
          </p>

          <ol className="instruction-steps">
            {chapter.steps.map((step, idx) => (
              <li key={idx} className="instruction-step">
                <span className="step-number">{idx + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Camera Panel */}
        <div className="camera-panel" id="camera-panel">
          <h2>📷 Practice Area</h2>

          <div className="camera-container" id="camera-container">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />
            
            {!isCameraActive && !isLoading && (
              <div className="camera-overlay">
                <div className="camera-overlay-content">
                  <div className="camera-overlay-icon">📷</div>
                  <p className="camera-overlay-text">
                    Click "Start Camera" to begin
                  </p>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="camera-overlay">
                <div className="camera-overlay-content">
                  <div className="camera-overlay-icon" style={{ animation: 'pulse 1s ease-in-out infinite' }}>⏳</div>
                  <p className="camera-overlay-text">
                    Loading hand detection model...
                  </p>
                </div>
              </div>
            )}

            {isCameraActive && <div className="camera-scanline" />}
          </div>

          {/* Detection Result */}
          <div className={`detection-result ${getDetectionStatus()}`} id="detection-result">
            {getStatusText()}
            {detectedLetter && getDetectionStatus() !== 'idle' && (
              <div className="detected-letter">
                {detectedLetter}
              </div>
            )}
          </div>

          {/* Confidence Bar */}
          {isCameraActive && (
            <div style={{
              width: '100%',
              height: '4px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-lg)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${confidence * 100}%`,
                height: '100%',
                background: hasBeenCorrect ? 'var(--success)' : 'var(--accent-gradient)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.2s ease',
              }} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: 'var(--space-md)',
              background: 'rgba(255, 82, 82, 0.1)',
              border: '1px solid rgba(255, 82, 82, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: '0.9rem',
              marginBottom: 'var(--space-lg)',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Camera Controls */}
          <div className="camera-controls">
            {!isCameraActive ? (
              <button 
                className="btn btn-primary" 
                onClick={startCamera}
                disabled={isLoading}
                id="start-camera-btn"
              >
                {isLoading ? '⏳ Loading...' : '📷 Start Camera'}
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-outline" 
                  onClick={stopCamera}
                  id="stop-camera-btn"
                >
                  ⏹ Stop Camera
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={resetDetection}
                  id="reset-btn"
                >
                  🔄 Reset
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="chapter-nav">
        <button
          className="nav-arrow prev"
          onClick={() => prevChapter && navigate(`/chapter/${prevChapter.letter}`)}
          disabled={!prevChapter}
          id="prev-chapter-btn"
        >
          ← {prevChapter ? `Letter ${prevChapter.letter}` : 'Start'}
        </button>
        <button
          className="nav-arrow next"
          onClick={() => nextChapter && navigate(`/chapter/${nextChapter.letter}`)}
          disabled={!nextChapter}
          id="next-chapter-btn"
        >
          {nextChapter ? `Letter ${nextChapter.letter}` : 'End'} →
        </button>
      </div>

      {/* Completion Overlay */}
      {showComplete && (
        <div className="chapter-complete-overlay" id="completion-overlay">
          <div className="chapter-complete-card">
            <div className="chapter-complete-icon">🎉</div>
            <h2>Chapter Complete!</h2>
            <p>
              You successfully signed the letter <strong>"{chapter.letter}"</strong>!
              {nextChapter ? ` Ready for letter "${nextChapter.letter}"?` : ' You\'ve completed all letters!'}
            </p>
            <div className="chapter-complete-actions">
              <button 
                className="btn btn-outline" 
                onClick={() => setShowComplete(false)}
                id="continue-practicing-btn"
              >
                Keep Practicing
              </button>
              {nextChapter ? (
                <button 
                  className="btn btn-success" 
                  onClick={() => navigate(`/chapter/${nextChapter.letter}`)}
                  id="next-lesson-btn"
                >
                  Next Lesson →
                </button>
              ) : (
                <button 
                  className="btn btn-success" 
                  onClick={() => navigate('/')}
                  id="go-home-btn"
                >
                  🏠 Go Home
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
