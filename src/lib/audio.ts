'use client';

/**
 * Audio Utility for Quiz Sound Effects
 */

const SOUND_URLS = {
  correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630aa820.mp3', // Simple success chime
  incorrect: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c3614a9388.mp3', // Simple error thud
  tick: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f5238206d2.mp3', // Quiet tick
  levelUp: 'https://cdn.pixabay.com/audio/2021/08/04/audio_06256f6874.mp3', // Level up fanfare
};

type SoundType = keyof typeof SOUND_URLS;

class AudioController {
  private enabled: boolean = true;
  private audios: Partial<Record<SoundType, HTMLAudioElement>> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dbq_sounds_enabled');
      this.enabled = saved !== 'false';
    }
  }

  toggle(on?: boolean) {
    this.enabled = on !== undefined ? on : !this.enabled;
    localStorage.setItem('dbq_sounds_enabled', String(this.enabled));
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(type: SoundType) {
    if (!this.enabled || typeof window === 'undefined') return;

    try {
      if (!this.audios[type]) {
        this.audios[type] = new Audio(SOUND_URLS[type]);
      }
      
      const audio = this.audios[type]!;
      audio.currentTime = 0;
      audio.volume = 0.3; // Low volume for non-intrusivity
      audio.play().catch(() => {
        // Ignore autoplay blocks
      });
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }
}

export const audioController = new AudioController();
