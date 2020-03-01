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
