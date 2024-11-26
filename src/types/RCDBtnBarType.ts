import { Audio } from 'expo-av'

export type RCDBtnBarProps = {
    record: () => void
    // pause: () => void
    play: () => void
    upload: () => void
    isPlaying: boolean
    // isPaused: boolean
    isDone: boolean
    recording: Audio.Recording | undefined
    reflesh : ()=>void
    stop: ()=>void
  }