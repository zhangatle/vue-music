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

export function getSingerSongList(singer) {
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

export function getSongVkey(songId) {
  const songVkeyUrl = '/api'
  const data = {
    ...qqMusicConfigParam,
    '-': 'getplaysongvkey07814529035805795',
    data: {
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': '6681544424',
          'songmid': [songId],
          'songtype': [0],
          'uin': '0',
          'loginflag': 1,
          'platform': '20'
        }
      },
      'comm': {
        'uin': 0,
        'format': 'json',
        'ct': 24,
        'cv': 0
      }
    }
  }
  return axios(songVkeyUrl, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getAlbumSongList(albumId) {
  const singerSongListUrl = '/getAlbumSongList'
  const data = {
    ...qqMusicConfigParam,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    new_format: 1,
    disstid: albumId
  }
  return axios(singerSongListUrl, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
