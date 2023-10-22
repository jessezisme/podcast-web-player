import { Howl, Howler } from 'howler';
import { useIntervalFn } from '@vueuse/core';
import { ServerResponse } from '@/shared/podcast/api/types/podcast-get';

type EpisodeType = ServerResponse['episodes'][0];
type PlayerType = {
  playerAudio: Howl;
  playerID: number | null;
  episode: EpisodeType;
  podcast?: ServerResponse;
  volume: number;
  progressSeconds: number;
  duration: number;
  pauseOnLoad?: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isLoaded: boolean;
};

export const useAudioPlayerStore = defineStore('audio', () => {
  const player = ref<PlayerType>();

  const checkStatusInterval = useIntervalFn(() => {
    updateProgressSeconds();
  }, 750);

  /**
   * Actions
   */
  const destroyAudio = () => {
    const getPlayer = unref(player);
    if (getPlayer) {
      getPlayer.playerAudio.pause();
      getPlayer.playerAudio.off();
      getPlayer.playerAudio.unload();
    }
  };

  const updateProgressSeconds = () => {
    const getPlayer = unref(player);
    const getProgress = getPlayer?.playerAudio ? Math.floor(getPlayer.playerAudio.seek()) : 1;
    console.log(getProgress);
    getPlayer && (getPlayer.progressSeconds = getProgress);
  };

  const pause = () => {
    player.value?.playerAudio?.pause();
  };

  const play = () => {
    if (player.value?.playerID) {
      player.value.playerAudio.play(player.value.playerID);
    } else {
      player.value && (player.value.playerID = player.value.playerAudio.play());
    }
  };

  const loadAndPlay = (_episode: MaybeRef<EpisodeType>) => {
    loadEpisode(_episode);
    play();
  };

  const skipSeek = (seconds: number) => {
    const getPlayer = unref(player);
    updateDuration();

    if (getPlayer) {
      const requestedTime = getPlayer.progressSeconds + seconds;
      const duration = getPlayer.duration;

      if (requestedTime > duration) {
        getPlayer.playerAudio.seek(duration);
      } else if (requestedTime < 1) {
        getPlayer.playerAudio.seek(1);
      } else {
        getPlayer.playerAudio.seek(requestedTime);
      }
    }
  };

  const seek = (seconds: number) => {
    if (player.value) {
      player.value.progressSeconds = seconds;
      player.value.playerAudio.seek(seconds);
    }
  };

  const updateVolume = (volume: number) => {
    player.value?.playerAudio.volume(volume);
  };

  const updateDuration = () => {
    const getPlayer = unref(player);
    const getDuration = getPlayer?.playerAudio ? getPlayer.playerAudio.duration() : 0;
    getPlayer && (getPlayer.duration = Math.floor(getDuration));
  };

  const audioLoadCallback = () => {
    if (player.value) {
      player.value.isLoaded = true;
      player.value.isLoading = false;
      play();
      updateDuration();
    }
  };

  const audioPlayCallback = () => {
    player.value && (player.value.isPlaying = true);
  };

  const audioPauseCallback = () => {
    player.value && (player.value.isPlaying = true);
  };

  const audioVolumeCallback = () => {
    const getPlayer = unref(player);

    if (getPlayer) {
      const playerAudioVolume = getPlayer.playerAudio.volume();
      const playerVolume = getPlayer.volume;
      playerAudioVolume !== playerVolume && (getPlayer.volume = playerAudioVolume);
    }
  };

  const audioLoadErrorCallback = () => {};

  const loadEpisode = (_episode: MaybeRef<EpisodeType>) => {
    const getEpisode = unref(_episode);
    const isNewEpisode = !player.value || player.value?.episode?.id !== getEpisode.id;
    const getVolume = player.value?.volume === 0 || player.value?.volume ? player.value?.volume : 1.0;

    if (isNewEpisode) {
      destroyAudio();
      const playerHowl = new Howl({
        src: [getEpisode.audio],
        html5: true,
        volume: getVolume,
        onload: audioLoadCallback,
        onplay: audioPlayCallback,
        onend: audioPauseCallback,
        onpause: audioPauseCallback,
        onvolume: audioVolumeCallback,
        onloaderror: audioLoadErrorCallback,
      });
      player.value = {
        playerAudio: playerHowl,
        playerID: null,
        episode: { ...getEpisode },
        volume: getVolume,
        progressSeconds: 0,
        duration: 0,
        isPlaying: false,
        isLoading: true,
        isLoaded: false,
      };
    }
  };

  return {
    player,
    pause,
    play,
    loadAndPlay,
    skipSeek,
    seek,
    updateVolume,
  };
});
