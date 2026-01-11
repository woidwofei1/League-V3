import { useCallback, useRef, useState, createContext, useContext, type ReactNode } from 'react';

interface TrashTalkContextType {
    playSound: (type: 'point' | 'streak' | 'setWin' | 'matchWin') => void;
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const TrashTalkContext = createContext<TrashTalkContextType | null>(null);

export function useTrashTalk() {
    const context = useContext(TrashTalkContext);
    if (!context) {
        return { playSound: () => { }, isEnabled: false, setEnabled: () => { } };
    }
    return context;
}

export function TrashTalkProvider({ children }: { children: ReactNode }) {
    const [isEnabled, setEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('trashTalkEnabled') !== 'false';
        }
        return true;
    });

    const audioContextRef = useRef<AudioContext | null>(null);

    const getAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioContextRef.current;
    }, []);

    const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
        try {
            const ctx = getAudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = type;
            oscillator.frequency.value = frequency;

            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.start();
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn('Audio playback failed:', e);
        }
    }, [getAudioContext]);

    const playSound = useCallback((type: 'point' | 'streak' | 'setWin' | 'matchWin') => {
        if (!isEnabled) return;

        switch (type) {
            case 'point':
                // Quick "ping" sound
                playTone(800, 0.1, 'sine');
                break;
            case 'streak':
                // Rising "whoosh" sound
                playTone(400, 0.15, 'square');
                setTimeout(() => playTone(600, 0.15, 'square'), 100);
                setTimeout(() => playTone(800, 0.2, 'square'), 200);
                break;
            case 'setWin':
                // Victory jingle
                playTone(523, 0.15, 'triangle'); // C
                setTimeout(() => playTone(659, 0.15, 'triangle'), 150); // E
                setTimeout(() => playTone(784, 0.3, 'triangle'), 300); // G
                break;
            case 'matchWin':
                // Epic fanfare
                playTone(523, 0.2, 'sawtooth');
                setTimeout(() => playTone(659, 0.2, 'sawtooth'), 200);
                setTimeout(() => playTone(784, 0.2, 'sawtooth'), 400);
                setTimeout(() => playTone(1047, 0.5, 'sawtooth'), 600);
                break;
        }
    }, [isEnabled, playTone]);

    const handleSetEnabled = useCallback((enabled: boolean) => {
        setEnabled(enabled);
        localStorage.setItem('trashTalkEnabled', String(enabled));
    }, []);

    return (
        <TrashTalkContext.Provider value={{ playSound, isEnabled, setEnabled: handleSetEnabled }}>
            {children}
        </TrashTalkContext.Provider>
    );
}
