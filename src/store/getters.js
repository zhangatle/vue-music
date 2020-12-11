export const singer = state => state.singer

// 播放器
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSongUrl = state => state.currentSongUrl
export const currentSong = state => {
  return state.playlist[state.currentIndex] || {}
}

export const album = state => state.album
export const top = state => state.top
