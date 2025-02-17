
export type RCDBtnProps = {
    record: () => void
    play: (uri: string) => void
    isPlaying: boolean
    isDone: boolean
    recording: boolean
    stop: ()=>void
  }