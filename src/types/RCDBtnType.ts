import { Audio } from 'expo-av'

export type RCDBtnProps = {
    record: () => void
    // pause: () => void
    play: () => void
    isPlaying: boolean
    // isPaused: boolean
    isDone: boolean
    recording: Audio.Recording | undefined
    stop: ()=>void
  }