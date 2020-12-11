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

export const disc = state=> state.disc
export const topList = state => state.topList
export const searchHistory = state => state.searchHistory
export const playHistory = state => state.playHistory
export const favoriteList = state => state.favoriteList
