import React, { useState, useEffect } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { Activity, Server, Users, ShieldCheck, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface BackendHealth {
  status: string;
  service?: string;
  version?: string;
}

export const App: React.FC = () => {
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = 'http://localhost:8000';

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: BackendHealth = await response.json();
      setBackendHealth(data);
    } catch (err: any) {
      console.warn("Backend connection fetch error:", err);
      setError(err.message || 'Failed to connect to FastAPI backend');
      setBackendHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    // Periodically poll backend status every 10 seconds
    const interval = setInterval(checkBackendHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Bar Navigation */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Face Attendance <span className="gradient-text">AI</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
            Real-time Face Recognition & Liveness Verification System
          </p>
        </div>

        {/* Backend Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className={`status-pill ${loading ? 'checking' : backendHealth?.status === 'healthy' ? 'healthy' : 'error'}`}>
            <span className="status-dot" />
            <span>
              {loading
                ? 'Connecting to Backend...'
                : backendHealth?.status === 'healthy'
                ? `System Healthy (${backendHealth.service || 'FastAPI'})`
                : 'Backend Offline'}
            </span>
          </div>
          <button
            onClick={checkBackendHealth}
            title="Re-check Connection"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-secondary)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Backend Server</span>
            <Server size={18} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {backendHealth?.status === 'healthy' ? (
              <>
                <CheckCircle2 style={{ color: 'var(--accent-green)' }} size={20} />
                <span>Connected</span>
              </>
            ) : (
              <>
                <XCircle style={{ color: 'var(--accent-red)' }} size={20} />
                <span>Disconnected</span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Target: {BACKEND_URL}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>AI Core Pipeline</span>
            <Activity size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>OpenCV / MediaPipe</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            ArcFace Vector Embeddings (128D)
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Active Registered Users</span>
            <Users size={18} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Ready</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Data Store: ai/data/embeddings/
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Anti-Spoofing</span>
            <ShieldCheck size={18} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-green)' }}>Active</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Liveness Blink & Motion Check
          </p>
        </div>
      </div>

      {/* Main Camera Feed Section */}
      <main style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <CameraFeed isBackendConnected={backendHealth?.status === 'healthy'} />
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '20px', padding: '16px 0', borderTop: '1px solid var(--bg-card-border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>face-attendance-ai &copy; 2026. Open Source Architecture.</span>
        <span>FastAPI + OpenCV + React TypeScript Monorepo</span>
      </footer>
    </div>
  );
};

export default App;
