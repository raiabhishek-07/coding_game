'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_LEVELS } from '@/lib/levels/index';
import { useGameStore } from '@/store/gameStore';
import { sfxClick, sfxHover, sfxLocked } from '@/lib/sounds';

const WORLD_META = [
  { id: 1, name: 'The Awakening Forest', icon: '🌲', theme: 'forest', color: '#00d4aa', firstLevel: '1-1' },
  { id: 2, name: 'Village of Logic', icon: '🏰', theme: 'village', color: '#ff6b35', firstLevel: '2-1' },
  { id: 3, name: 'The Mage Tower', icon: '🔮', theme: 'tower', color: '#9b5de5', firstLevel: '3-1' },
  { id: 4, name: 'The Ancient Vault', icon: '🏺', theme: 'vault', color: '#ffd700', firstLevel: '4-1' },
  { id: 5, name: 'The Inferno Keep', icon: '🌋', theme: 'inferno', color: '#ff4757', firstLevel: '5-1' },
  { id: 6, name: 'The Shadow Realm', icon: '👁️', theme: 'shadow', color: '#a855f7', firstLevel: '6-1' },
];

export default function HomePage() {
  const router = useRouter();
  const { levelProgress, xp, gems, streak } = useGameStore();
  const [mounted, setMounted] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  /** A level is unlocked if it's 1-1, OR the previous level in ALL_LEVELS is completed */
  const isLevelUnlocked = (levelId: string): boolean => {
    if (levelId === '1-1') return true;
    const allIds = ALL_LEVELS.map(l => l.id);
    const idx = allIds.indexOf(levelId);
    if (idx <= 0) return true;
    const prevId = allIds[idx - 1];
    return levelProgress[prevId]?.completed === true;
  };

  /** A world is unlocked if its FIRST level is unlocked */
  const isWorldUnlocked = (worldId: number): boolean => {
    const worldLevels = ALL_LEVELS.filter(l => l.world === worldId);
    if (worldLevels.length === 0) return false;
    return isLevelUnlocked(worldLevels[0].id);
  };

  const getStars = (levelId: string) => levelProgress[levelId]?.stars || 0;
  const totalCompleted = Object.values(levelProgress).filter(p => p.completed).length;
  const playerLevel = Math.floor(xp / 500) + 1;

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: '100vh',
      height: 'auto',
      background: '#080810',
      color: '#e8e8ff',
      fontFamily: 'Inter, sans-serif',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Animated background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(79,143,255,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(155,93,229,0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Header */}
        <div style={{
          textAlign: 'center', padding: '60px 20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
        }}>
          {/* Top Right Links */}
          <div style={{
            position: 'absolute', top: '24px', right: '24px',
            display: 'flex', gap: '16px'
          }}>
            <button
              onClick={() => {
                sfxClick();
                router.push('/multiplayer');
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,80,0,0.1), rgba(255,40,0,0.05))',
                border: '1px solid rgba(255,80,0,0.2)',
                borderRadius: '24px', padding: '8px 16px',
                color: '#e8e8ff', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 0 10px rgba(255,80,0,0.1)',
              }}
              onMouseEnter={(e) => {
                sfxHover();
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,80,0,0.2), rgba(255,40,0,0.1))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,80,0,0.1), rgba(255,40,0,0.05))';
              }}
            >
              <span style={{ fontSize: '16px' }}>⚔️</span> Multiplayer Duel
            </button>

            <button
              onClick={() => {
                sfxClick();
                router.push('/algo-quest');
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(0,200,255,0.1), rgba(0,100,255,0.05))',
                border: '1px solid rgba(0,200,255,0.2)',
                borderRadius: '24px', padding: '8px 16px',
                color: '#e8e8ff', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 0 10px rgba(0,200,255,0.1)',
              }}
              onMouseEnter={(e) => {
                sfxHover();
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,200,255,0.2), rgba(0,100,255,0.1))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,200,255,0.1), rgba(0,100,255,0.05))';
              }}
            >
              <span style={{ fontSize: '16px' }}>🧩</span> AlgoQuest
            </button>

            <button
              onClick={() => {
                sfxClick();
                router.push('/trophies');
              }}
              style={{
                background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                borderRadius: '10px', padding: '8px 16px',
                color: '#ffd700', cursor: 'pointer', fontSize: '13px',
                fontFamily: 'Inter', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                sfxHover();
                e.currentTarget.style.background = 'rgba(255,215,0,0.18)';
              }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; }}
            >
              🏆 Trophies
            </button>
          </div>

          <div style={{ fontSize: '48px', marginBottom: '12px', animation: 'float 3s ease-in-out infinite' }}>⚔️</div>
          <h1 style={{
            fontFamily: "'Press Start 2P'",
            fontSize: 'clamp(16px, 3vw, 28px)',
            background: 'linear-gradient(135deg, #4f8fff, #9b5de5)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '12px', lineHeight: 1.4,
          }}>
            CodeQuest
          </h1>
          <p style={{ fontSize: '16px', color: '#888', marginBottom: '30px' }}>
            Learn JavaScript by controlling a warrior with real code
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'inline-flex', gap: '20px', alignItems: 'center',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '12px 24px',
          }}>
            {[
              { icon: '🧙‍♂️', label: 'Level', value: playerLevel, color: '#4f8fff' },
              { icon: '⭐', label: 'XP', value: xp, color: '#9b5de5' },
              { icon: '💎', label: 'Gems', value: gems, color: '#ffd700' },
              { icon: '🔥', label: 'Streak', value: streak + 'd', color: '#ff6b35' },
              { icon: '🏆', label: 'Done', value: `${totalCompleted}/${ALL_LEVELS.length}`, color: '#00d4aa' },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div style={{ width: '1px', height: '30px', background: '#222' }} />}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px' }}>{s.icon}</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>{s.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.value}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* World Map */}
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '14px', fontFamily: "'Press Start 2P'", color: '#555', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '2px' }}>
            — World Map —
          </h2>

          {WORLD_META.map(world => {
            const worldLevels = ALL_LEVELS.filter(l => l.world === world.id);
            const worldCompleted = worldLevels.filter(l => levelProgress[l.id]?.completed).length;
            const worldUnlocked = isWorldUnlocked(world.id);

            return (
              <div key={world.id} style={{
                marginBottom: '32px',
                opacity: worldUnlocked ? 1 : 0.4,
                transition: 'opacity 0.3s',
              }}>
                {/* World Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
                  padding: '12px 16px',
                  background: `linear-gradient(135deg, ${world.color}10, transparent)`,
                  border: `1px solid ${world.color}30`,
                  borderRadius: '10px',
                }}>
                  <span style={{ fontSize: '24px' }}>{world.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: world.color }}>
                      World {world.id}: {world.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {!worldUnlocked
                        ? '🔒 Locked — Complete previous world to unlock'
                        : `${worldCompleted}/${worldLevels.length} levels complete`}
                    </div>
                  </div>
                  {worldUnlocked && worldCompleted > 0 && (
                    <div style={{ marginLeft: 'auto' }}>
                      <div style={{ width: '120px', height: '6px', background: '#1a1a2e', borderRadius: '3px' }}>
                        <div style={{
                          height: '100%', borderRadius: '3px',
                          width: `${(worldCompleted / worldLevels.length) * 100}%`,
                          background: world.color, transition: 'width 0.5s',
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Level Nodes */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {worldLevels.length > 0 ? worldLevels.map(level => {
                    const unlocked = worldUnlocked && isLevelUnlocked(level.id);
                    const prog = levelProgress[level.id];
                    const stars = getStars(level.id);
                    const isHovered = hoveredLevel === level.id;

                    return (
                      <div
                        key={level.id}
                        id={`level-${level.id}`}
                        onClick={() => {
                          if (unlocked) {
                            sfxClick();
                            router.push(`/game/${level.id}`);
                          } else {
                            sfxLocked();
                          }
                        }}
                        onMouseEnter={() => {
                          if (unlocked) sfxHover();
                          setHoveredLevel(level.id);
                        }}
                        onMouseLeave={() => setHoveredLevel(null)}
                        style={{
                          width: '160px',
                          background: isHovered && unlocked
                            ? `linear-gradient(135deg, ${world.color}20, ${world.color}10)`
                            : 'rgba(255,255,255,0.03)',
                          border: `2px solid ${prog?.completed ? world.color : unlocked ? world.color + '44' : '#222'}`,
                          borderRadius: '12px', padding: '14px',
                          cursor: unlocked ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s',
                          transform: isHovered && unlocked ? 'translateY(-3px)' : 'none',
                          boxShadow: isHovered && unlocked ? `0 8px 24px ${world.color}22` : 'none',
                          position: 'relative',
                        }}
                      >
                        <div style={{ fontSize: '10px', fontFamily: "'Press Start 2P'", color: world.color, marginBottom: '6px', opacity: 0.8 }}>
                          L{level.level}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#ccc', marginBottom: '4px', lineHeight: 1.3 }}>
                          {level.title}
                        </div>
                        <div style={{ fontSize: '9px', color: world.color, opacity: 0.7, fontFamily: 'JetBrains Mono', marginBottom: '8px' }}>
                          {level.concept.split('—')[0].split('&')[0].trim()}
                        </div>
                        {/* Stars */}
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3].map(s => (
                            <span key={s} style={{ fontSize: '12px', opacity: s <= stars ? 1 : 0.2 }}>⭐</span>
                          ))}
                        </div>
                        {/* Lock overlay */}
                        {!unlocked && (
                          <div style={{
                            position: 'absolute', inset: 0, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            borderRadius: '12px', background: 'rgba(0,0,0,0.5)',
                          }}>
                            <span style={{ fontSize: '18px' }}>🔒</span>
                          </div>
                        )}
                        {/* Completed badge */}
                        {prog?.completed && (
                          <div style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '14px' }}>✅</div>
                        )}
                      </div>
                    );
                  }) : (
                    <div style={{ fontSize: '12px', color: '#333', fontFamily: 'JetBrains Mono', padding: '10px' }}>
                      🚧 Coming soon...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div style={{
          textAlign: 'center', padding: '30px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <button
            id="start-quest-btn"
            onClick={() => {
              sfxClick();
              // Find the first incomplete level that's unlocked
              const next = ALL_LEVELS.find(l => !levelProgress[l.id]?.completed && isLevelUnlocked(l.id));
              router.push(`/game/${next?.id || '1-1'}`);
            }}
            style={{
              background: 'linear-gradient(135deg, #4f8fff, #9b5de5)',
              border: 'none', borderRadius: '10px',
              padding: '14px 40px', color: '#fff',
              cursor: 'pointer', fontSize: '14px', fontWeight: 700,
              fontFamily: 'Inter', boxShadow: '0 4px 20px rgba(79,143,255,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              sfxHover();
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {totalCompleted > 0 ? '▶ Continue Quest' : '⚔️ Start Your Quest'}
          </button>
          <p style={{ marginTop: '16px', color: '#333', fontSize: '12px' }}>
            {30 - totalCompleted} levels remaining · Progress auto-saved
          </p>
        </div>
      </div>
    </div>
  );
}
