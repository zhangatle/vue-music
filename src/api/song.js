import {qqMusicConfigParam} from './config'
import axios from 'axios'

export const getLyric = function (songId) {
  const lyricUrl = '/lyric'
  const data = {
    ...qqMusicConfigParam,
    '-': 'MusicJsonCallback_lrc',
    pcachetime: +new Date(),
    songmid: songId,
    g_tk: 1137451523
  }

  return axios
    .get(lyricUrl, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
