import { SoundType } from "./SoundType";

export interface SoundContextType {
  playSound: (type: SoundType) => void;
  setVolume: (volume: number) => void;
}
