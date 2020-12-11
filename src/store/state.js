import {playMode} from 'common/js/config'
import {loadSearch, loadFavorite, loadPlay} from '@/common/js/cache'

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
  top: {},
  disc:{},
  searchHistory: loadSearch(),
  playHistory:loadPlay(),
  favoriteList:loadFavorite(),
  topList:{}
}
export default state
