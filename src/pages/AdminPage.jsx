import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';
import { CreditCard, Save } from 'lucide-react';

export default function AdminPage() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount)) {
      setStatus('Please enter a valid number.');
      return;
    }

    setIsSaving(true);
    setStatus('Saving...');

    try {
      const noteRef = ref(db, 'notedenomination');
      await set(noteRef, Number(amount));
      setStatus(`Successfully updated detection amount to ₹${amount}!`);
      setAmount('');
    } catch (error) {
      console.error('Firebase error:', error);
      setStatus('Failed to save to Firebase. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="chapter-content">
      <div className="instructions-panel" style={{ margin: '0 auto', maxWidth: '500px' }}>
        <h2>
          <CreditCard size={20} style={{ marginRight: '8px' }} />
          Admin Update Override
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Enter an amount below to manually override the detected note. The Note Detection page will instantly pick up this value and show it as "scanned".
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Denomination Amount (₹)</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface-sunken)',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSaving}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Save size={18} />
            {isSaving ? 'Updating...' : 'Update Note Detection'}
          </button>

          {status && (
            <div style={{
              padding: '1rem',
              borderRadius: '8px',
              background: status.includes('Success') ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              color: status.includes('Success') ? '#2ecc71' : '#e74c3c',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
