import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  mode: playMode.sequence,
  sequenceList: [],
  currentIndex: -1,
  currentSongUrl: '',
  album: {},
  top: {}
}
export default state
