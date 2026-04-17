import { useNavigate } from 'react-router-dom';
import { Hand } from 'lucide-react';

export default function Navbar({ completedCount, totalCount, progressPercent }) {
  const navigate = useNavigate();
  
  // SVG progress ring calculation
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} id="navbar-brand">
        <Hand size={24} className="navbar-brand-icon" />
        <span>SignLingo</span>
      </div>

      <div className="navbar-stats">
        <div className="navbar-stat">
          <span>Progress:</span>
          <span className="navbar-stat-value">{completedCount}/{totalCount}</span>
        </div>
        
        <svg className="progress-ring" viewBox="0 0 36 36">
          <circle className="bg" cx="18" cy="18" r={radius} />
          <circle
            className="progress"
            cx="18"
            cy="18"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text
            x="18"
            y="18"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent-secondary)"
            fontSize="8"
            fontWeight="700"
            fontFamily="var(--font-display)"
          >
            {Math.round(progressPercent)}%
          </text>
        </svg>
      </div>
    </nav>
  );
}
