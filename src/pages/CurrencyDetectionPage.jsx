import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, CreditCard, Sparkles, AlertTriangle } from 'lucide-react';
import { useCurrencyDetection } from '../hooks/useCurrencyDetection';

const supportedNotes = [20, 50, 100, 500];

export default function CurrencyDetectionPage() {
  const navigate = useNavigate();
  const {
    videoRef,
    canvasRef,
    isLoading,
    isCameraActive,
    detectedDenomination,
    confidence,
    error,
    startCamera,
    stopCamera,
    resetDetection,
  } = useCurrencyDetection();

  const getStatus = () => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    if (!isCameraActive) return 'idle';
    if (detectedDenomination) return 'detected';
    if (confidence > 0) return 'scanning';
    return 'idle';
  };

  const statusText = {
    idle: 'Click Start Camera and place a note inside the guide area.',
    loading: 'Preparing your camera…',
    scanning: `Scanning currency (${Math.round(confidence * 100)}% confidence)...`,
    detected: `Detected ₹${detectedDenomination}!`,
    error: error,
  };

  return (
    <div className="currency-page">
      <div className="chapter-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="chapter-title-group">
          <h1>Indian Rupee Detection</h1>
          <div className="chapter-subtitle">
            Scan only ₹20, ₹50, ₹100, and ₹500 notes with your webcam.
          </div>
        </div>
      </div>

      <div className="chapter-content">
        <div className="instructions-panel">
          <h2>
            <CreditCard size={20} style={{ marginRight: '8px' }} />
            How it works
          </h2>

          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '0.95rem' }}>
            Use your camera to scan the front of an Indian rupee note. The app checks the note color and pattern to identify supported denominations.
          </p>

          <div className="supported-notes">
            <div className="supported-notes-title">Supported denominations</div>
            <div className="supported-notes-list">
              {supportedNotes.map(note => (
                <div key={note} className="supported-note-card">
                  <span>₹{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="currency-tips">
            <div>
              <Sparkles size={18} style={{ marginRight: '8px' }} />
              Place the note flat and fill most of the guide area.
            </div>
            <div>
              <AlertTriangle size={18} style={{ marginRight: '8px' }} />
              Use good lighting and avoid reflections.
            </div>
          </div>
        </div>

        <div className="camera-panel">
          <h2>
            <Camera size={20} style={{ marginRight: '8px' }} />
            Currency Scanner
          </h2>

          <div className="camera-container">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />

            {!isCameraActive && !isLoading && (
              <div className="camera-overlay">
                <div className="camera-overlay-content">
                  <Camera size={48} className="camera-overlay-icon" />
                  <p className="camera-overlay-text">Start Camera to begin scanning</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="camera-overlay">
                <div className="camera-overlay-content">
                  <div className="camera-overlay-icon">⏳</div>
                  <p className="camera-overlay-text">Loading camera…</p>
                </div>
              </div>
            )}

            {isCameraActive && <div className="camera-scanline" />}
          </div>

          <div className={`detection-result ${getStatus()}`}>
            {statusText[getStatus()]}
            {detectedDenomination && (
              <div className="detected-letter">₹{detectedDenomination}</div>
            )}
          </div>

          {error && (
            <div className="error-box">⚠️ {error}</div>
          )}

          <div className="camera-controls">
            {!isCameraActive ? (
              <button className="btn btn-primary" onClick={startCamera} disabled={isLoading}>
                {isLoading ? 'Starting Camera…' : 'Start Camera'}
              </button>
            ) : (
              <>
                <button className="btn btn-outline" onClick={stopCamera}>Stop Camera</button>
                <button className="btn btn-outline" onClick={resetDetection}>Reset</button>
              </>
            )}
          </div>

          <button className="btn btn-outline guide-link" onClick={() => navigate('/currency-guide')}>
            View Detection Guide
          </button>
        </div>
      </div>
    </div>
  );
}
