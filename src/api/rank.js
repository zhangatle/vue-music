import {qqMusicConfigParam} from './config'
import axios from 'axios'

export function getTopList() {
  const topListUrl = '/api'
  const data = {
    ...qqMusicConfigParam,
    '-': 'recom' + (+new Date()),
    data: {
      comm: {
        ct: 24
      },
      toplist: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetAll',
        param: {}
      }
    }
  }
  return axios.get(topListUrl, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export const getTopListSongs = function (topId) {
  const topSongUrl = '/api'
  const data = {
    '-': 'getUCGI4195015404019351',
    'needNewCode': 0,
    'data': {
      'detail': {
        'module': 'musicToplist.ToplistInfoServer',
        'method': 'GetDetail',
        'param': {
          'topId': topId,
          'offset': 0,
          'num': 20
          // 'period': '2020-02-25'
        }
      },
      'comm': {
        'ct': 24,
        'cv': 0
      }
    }
  }
  return axios
    .get(topSongUrl, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
