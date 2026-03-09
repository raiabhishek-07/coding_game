'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ALL_LEVELS } from '@/lib/levels/index';
import { useGameStore } from '@/store/gameStore';
import HUD from '@/components/HUD/HUD';
import GameScreen from '@/components/GameScreen/GameScreen';
import ExplanationPanel from '@/components/ExplanationPanel/ExplanationPanel';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import ConsolePanel from '@/components/ConsolePanel/ConsolePanel';
import ByteCompanion from '@/components/Companion/ByteCompanion';
import LevelCompleteModal from '@/components/LevelComplete/LevelCompleteModal';
import StreakCelebration from '@/components/StreakCelebration/StreakCelebration';
import AIChat from '@/components/AIChat/AIChat';
import LevelBriefingModal from '@/components/LevelBriefing/LevelBriefingModal';

const WORLD_THEMES: Record<string, { bg: string; accent: string; icon: string }> = {
    forest: { bg: 'linear-gradient(135deg, #0d1f0d, #1a3a1a)', accent: '#00d4aa', icon: '🌲' },
    village: { bg: 'linear-gradient(135deg, #1f140d, #3a2a1a)', accent: '#ff6b35', icon: '🏰' },
    tower: { bg: 'linear-gradient(135deg, #0d0d1f, #1a1a3a)', accent: '#9b5de5', icon: '🔮' },
    vault: { bg: 'linear-gradient(135deg, #1a0f0a, #2a1a10)', accent: '#ffd700', icon: '🏺' },
    inferno: { bg: 'linear-gradient(135deg, #1f0a0a, #3a0d0d)', accent: '#ff4757', icon: '🌋' },
    shadow: { bg: 'linear-gradient(135deg, #050510, #0a0a20)', accent: '#a855f7', icon: '👁️' },
};

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const { setLevel, setGamePhase, updateStreak } = useGameStore();

    const [showModal, setShowModal] = useState(false);
    const [lastStars, setLastStars] = useState(0);
    const [flashSuccess, setFlashSuccess] = useState(false);
    const [flashDefeat, setFlashDefeat] = useState(false);
    const [showBriefing, setShowBriefing] = useState(true);

    const levelId = params?.level as string;
    const level = ALL_LEVELS.find(l => l.id === levelId) || ALL_LEVELS[0];
    const theme = WORLD_THEMES[level.worldTheme] || WORLD_THEMES.forest;

    // Time limit scales by world difficulty (W1=3:30min ... W6=11min)
    const timeLimit = level.world * 90 + 120;

    useEffect(() => {
        setLevel(level.world, level.level);
        updateStreak();
        setShowModal(false);
        setShowBriefing(true);
        setLastStars(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [levelId]);

    const handleSuccess = (stars: number) => {
        setLastStars(stars);
        setFlashSuccess(true);
        setTimeout(() => {
            setFlashSuccess(false);
            setShowModal(true);
        }, 800);
    };

    const handleRetry = () => setGamePhase('retry');

    const handleNextLevel = () => {
        setShowModal(false);
        const currentIdx = ALL_LEVELS.findIndex(l => l.id === levelId);
        const next = ALL_LEVELS[currentIdx + 1];
        if (next) router.push(`/game/${next.id}`);
        else router.push('/');
    };

    const handleReplay = () => {
        setShowModal(false);
        setGamePhase('idle');
    };

    const handleDefeated = () => {
        // Red flash, then reset to idle so player can fix & retry
        setFlashDefeat(true);
        setTimeout(() => setFlashDefeat(false), 1200);
        setGamePhase('retry');
    };

    return (
        <div style={{
            height: '100vh', maxHeight: '100vh',
            display: 'flex', flexDirection: 'column',
            background: '#0a0a0f', overflow: 'hidden',
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        }}>
            {/* HUD */}
            <HUD
                worldTheme={level.worldTheme}
                levelTitle={level.title}
                levelConcept={level.concept}
                onTrophies={() => router.push('/trophies')}
            />

            {/* Streak milestone celebration */}
            <StreakCelebration />

            {/* Gold success flash */}
            {flashSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 998,
                    background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
                    pointerEvents: 'none', animation: 'fadeIn 0.2s ease',
                }} />
            )}

            {/* Red defeat flash */}
            {flashDefeat && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 998,
                    background: 'radial-gradient(circle, rgba(255,71,87,0.25) 0%, transparent 70%)',
                    pointerEvents: 'none', animation: 'fadeIn 0.3s ease',
                }} />
            )}

            {/* Level Complete Modal */}
            <LevelCompleteModal
                visible={showModal}
                stars={lastStars}
                xpEarned={level.xpReward}
                gemsEarned={level.gemReward}
                levelTitle={level.title}
                accentColor={theme.accent}
                onNext={handleNextLevel}
                onReplay={handleReplay}
                onHome={() => { setShowModal(false); router.push('/'); }}
            />

            {/* 4-Panel Layout */}
            <div style={{
                flex: 1, display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '2px', background: '#050508',
                overflow: 'hidden',
                borderTop: `1px solid ${theme.accent}22`,
            }}>
                {/* Top-Left: Game Screen */}
                <div style={{ borderRight: '2px solid #1a1a2e', borderBottom: '2px solid #1a1a2e', overflow: 'hidden', position: 'relative' }}>
                    <GameScreen
                        worldTheme={level.worldTheme}
                        levelTitle={level.title}
                        theme={theme}
                        onNextLevel={handleNextLevel}
                        timeLimit={timeLimit}
                        onDefeated={handleDefeated}
                        isPaused={showBriefing}
                    />
                    <ByteCompanion />
                </div>

                {/* Top-Right: Explanation */}
                <div style={{ borderBottom: '2px solid #1a1a2e', overflow: 'hidden' }}>
                    <ExplanationPanel level={level} theme={theme} />
                </div>

                {/* Bottom-Left: Code Editor */}
                <div style={{ borderRight: '2px solid #1a1a2e', overflow: 'hidden' }}>
                    <CodeEditor
                        level={level}
                        theme={theme}
                        onSuccess={handleSuccess}
                        onRetry={handleRetry}
                    />
                </div>

                {/* Bottom-Right: Console */}
                <div style={{ overflow: 'hidden' }}>
                    <ConsolePanel />
                </div>
            </div>

            {/* AI Chat Companion Overlay */}
            <AIChat
                levelId={level.id}
                levelTitle={level.title}
                levelDescription={level.objective}
                levelConcept={level.concept}
                levelHints={level.hints}
            />

            {/* Level Briefing Modal - Displays on level entry */}
            {showBriefing && (
                <LevelBriefingModal
                    level={level}
                    theme={theme}
                    onReady={() => setShowBriefing(false)}
                    onExit={() => router.push('/')}
                />
            )}
        </div>
    );
}
