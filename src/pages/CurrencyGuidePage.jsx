import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Sparkles, Info, ShieldCheck } from 'lucide-react';

const guideSteps = [
  {
    title: 'Position the note',
    description: 'Place the note flat inside the blue guide box. Center it so most of the note is visible to the camera.',
  },
  {
    title: 'Use good lighting',
    description: 'Bright, even lighting helps the system read color and texture more accurately.',
  },
  {
    title: 'Avoid glare and shadows',
    description: 'Keep the note away from strong reflections and sharp shadows.',
  },
  {
    title: 'Keep it close',
    description: 'Hold the note closer to the camera so the scanner can capture detail without your face or background dominating the frame.',
  },
  {
    title: 'Scan supported notes only',
    description: 'This feature works for ₹20, ₹50, ₹100, and ₹500 notes only.',
  },
];

export default function CurrencyGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="currency-page">
      <div className="chapter-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="chapter-title-group">
          <h1>Note Detection Guide</h1>
          <div className="chapter-subtitle">
            Simple steps to improve rupee scanning accuracy in the detection feature.
          </div>
        </div>
      </div>

      <div className="instructions-panel">
        <h2>
          <Info size={20} style={{ marginRight: '8px' }} />
          How to scan notes successfully
        </h2>

        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: '0.95rem' }}>
          The scanner works best when the note fills the central detection area and the camera can clearly see the note surface. Follow these steps for more reliable results.
        </p>

        <div className="guide-step-list">
          {guideSteps.map((step, index) => (
            <div key={step.title} className="guide-step-card">
              <div className="guide-step-number">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="guide-highlight-box">
          <ShieldCheck size={24} style={{ marginRight: '10px' }} />
          <div>
            <strong>Tip:</strong> If the camera sees your face or background, the system may still work, but accuracy is best when the note is the central object.
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/currency')}>
          Open Currency Scanner
        </button>
      </div>
    </div>
  );
}
