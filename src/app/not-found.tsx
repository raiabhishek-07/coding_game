export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh', background: '#080810',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Inter, sans-serif', color: '#e8e8ff',
            textAlign: 'center', padding: '20px',
        }}>
            <div style={{ fontSize: '80px', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>⚔️</div>

            <h1 style={{
                fontFamily: "'Press Start 2P'", fontSize: '24px',
                color: '#ff4757', marginBottom: '16px', lineHeight: 1.5,
            }}>
                404
            </h1>

            <h2 style={{
                fontFamily: "'Press Start 2P'", fontSize: '12px',
                color: '#9b5de5', marginBottom: '24px', lineHeight: 1.8,
            }}>
                LEVEL NOT FOUND
            </h2>

            <p style={{ fontSize: '14px', color: '#888', marginBottom: '40px', maxWidth: '400px', lineHeight: 1.7 }}>
                The warrior wandered off the map! This level does not exist. Return to the World Map and choose a valid quest.
            </p>

            <a href="/" style={{
                background: 'linear-gradient(135deg, #4f8fff, #9b5de5)',
                border: 'none', borderRadius: '10px', padding: '14px 40px',
                color: '#fff', textDecoration: 'none', fontSize: '14px',
                fontWeight: 700, fontFamily: 'Inter',
                boxShadow: '0 4px 20px rgba(79,143,255,0.3)',
            }}>
                🗺️ Back to World Map
            </a>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@700&display=swap');
      `}</style>
        </div>
    );
}
