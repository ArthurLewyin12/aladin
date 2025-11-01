export interface TTSReaderOptions {
  autoplay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface TTSReaderControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  error: string | null;
  currentWord: {
    text: string;
    sentenceIndex: number;
    wordIndex: number;
  } | null;
}
