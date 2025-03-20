
export type RCDBtnProps = {
    record: () => void
    play: () => void
    isPlaying: boolean
    isDone: boolean
    recording: boolean
    stop: ()=>void
  }