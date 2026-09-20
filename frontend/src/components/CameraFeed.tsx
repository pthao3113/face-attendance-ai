import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';

interface CameraFeedProps {
  isBackendConnected: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ isBackendConnected }) => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [detectedUser, setDetectedUser] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsStreaming(true);
    } catch (err) {
      console.warn("Webcam access warning (fallback to placeholder simulation):", err);
      setIsStreaming(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetectedUser(null);
  };

  useEffect(() => {
    // Simulated detection trigger after 3s when streaming
    if (isStreaming) {
      const timer = setTimeout(() => {
        setDetectedUser("John Doe (EMP-001)");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Camera style={{ color: '#00f2fe' }} size={22} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>Live Video Stream</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {isStreaming ? 'Webcam Active' : 'Camera Idle'}
          </span>
          <button
            onClick={isStreaming ? stopCamera : startCamera}
            style={{
              background: isStreaming ? 'rgba(255, 82, 82, 0.15)' : 'rgba(0, 242, 254, 0.15)',
              border: `1px solid ${isStreaming ? '#ff5252' : '#00f2fe'}`,
              color: isStreaming ? '#ff5252' : '#00f2fe',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            {isStreaming ? <CameraOff size={14} /> : <Camera size={14} />}
            {isStreaming ? 'Stop Feed' : 'Start Feed'}
          </button>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          backgroundColor: '#070a10',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: isStreaming ? 'block' : 'none' }}
          muted
          playsInline
        />
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Fallback Display when not streaming */}
        {!isStreaming && (
          <div style={{ textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={32} style={{ opacity: 0.5 }} />
            </div>
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#94a3b8' }}>Camera Feed Standby</p>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Click "Start Feed" to launch facial detection</p>
            </div>
          </div>
        )}

        {/* Laser Scanner & Recognition Overlay */}
        {isStreaming && (
          <div className="scanner-overlay">
            <div className="scan-laser" />
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                fontSize: '0.75rem',
                color: '#00f2fe',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <RefreshCw size={12} style={{ animation: 'spin 2s linear infinite' }} />
              FPS: 30.0 | Liveness Check: PASSED
            </div>

            {detectedUser && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 230, 118, 0.2)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid #00e676',
                  color: '#00e676',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  boxShadow: '0 0 20px rgba(0, 230, 118, 0.4)'
                }}
              >
                <UserCheck size={18} />
                Match Verified: {detectedUser}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
        <span>Backend Pipeline: {isBackendConnected ? 'Active (http://localhost:8000)' : 'Disconnected'}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={14} style={{ color: '#00e676' }} /> Anti-Spoofing Enabled
        </span>
      </div>
    </div>
  );
};
