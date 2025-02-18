
export type RCDBtnBarProps = {
    record: () => void
    // pause: () => void
    play: (uri: string) => void
    upload: () => void
    isPlaying: boolean
    // isPaused: boolean
    isDone: boolean
    recording: boolean
    refresh : ()=>void
    stop: ()=>void
  }