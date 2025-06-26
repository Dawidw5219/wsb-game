import { useCallback, useRef, useEffect } from "react";
import type { SoundType, SoundContextType } from "@/types";

export const useSound = (): SoundContextType => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const volumeRef = useRef(0.3);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
    };

    document.addEventListener("click", initAudio, { once: true });
    document.addEventListener("keydown", initAudio, { once: true });

    return () => {
      document.removeEventListener("click", initAudio);
      document.removeEventListener("keydown", initAudio);
    };
  }, []);

  const createTone = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!audioContextRef.current) return;

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volumeRef.current,
        audioContextRef.current.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContextRef.current.currentTime + duration
      );

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    },
    []
  );

  const playSound = useCallback(
    (type: SoundType) => {
      switch (type) {
        case "hover":
          createTone(800, 0.1, "sine");
          break;
        case "click":
          createTone(600, 0.15, "square");
          setTimeout(() => createTone(900, 0.1, "sine"), 50);
          break;
        case "roll":
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              createTone(400 + Math.random() * 200, 0.1, "sawtooth");
            }, i * 30);
          }
          break;
        case "win":
          createTone(523, 0.2, "sine");
          setTimeout(() => createTone(659, 0.2, "sine"), 100);
          setTimeout(() => createTone(784, 0.3, "sine"), 200);
          break;
        case "lose":
          createTone(200, 0.3, "sawtooth");
          setTimeout(() => createTone(150, 0.3, "sawtooth"), 150);
          break;
      }
    },
    [createTone]
  );

  const setVolume = useCallback((volume: number) => {
    volumeRef.current = Math.max(0, Math.min(1, volume));
  }, []);

  return { playSound, setVolume };
};
