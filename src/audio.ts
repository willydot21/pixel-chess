
export const playAudio = (audioPath: string, volume: number = 1) => {
  const audio = new Audio(audioPath);
  audio.volume = volume;
  audio.play();
}


export const play = {
  move: (volume: number = 1) => playAudio('assets/sounds/move.mp3', volume),
  capture: (volume: number = 1) => playAudio('assets/sounds/capture.mp3', volume),
  notify: (volume: number = 1) => playAudio('assets/sounds/notify.mp3', volume),
  check: (volume: number = 1) => playAudio('assets/sounds/move-check.mp3', volume),
  castle: (volume: number = 1) => playAudio('assets/sounds/castle.mp3', volume),
  promotion: (volume: number = 1) => playAudio('assets/sounds/promote.mp3', volume),
}