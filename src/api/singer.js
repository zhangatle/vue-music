import {qqMusicConfigParam} from './config'
import axios from 'axios'

export function getSinger() {
  const singerInfoUrl = '/v8'
  const data = {
    ...qqMusicConfigParam,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  }
  return axios.get(singerInfoUrl, {params: data}).then(res => {
    return Promise.resolve(res.data)
  })
}

export const getSingerSongList = function (singer) {
  const singerSongListUrl = '/api'
  const data = {
    ...qqMusicConfigParam,
    '-': 'getSingerSong5820184818895127',
    data: {
      'comm': {
        'ct': 24,
        'cv': 0
      },
      'singerSongList': {
        'method': 'GetSingerSongList',
        'param': {
          'order': 1,
          'singerMid': singer.id,
          'begin': 0,
          'num': 20
        },
        'module': 'musichall.song_list_server'
      }
    }
  }
  return axios(singerSongListUrl, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
