const axios = require('axios')
const vueAxios = axios.create({
  headers: {
    origin: 'https://y.qq.com/',
    'sec-fetch-site': 'same-site',
    'access-control-allow-origin': 'https://y.qq.com',
    'access-control-expose-headers': 'Area',
    referer: 'https://c.y.qq.com/'
  },
  timeout: 3000
})

const sendAxiosAjax = (url, params) => {
  return Promise.resolve(
    vueAxios.get(url, {
      params
    })
  )
}
const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

module.exports = function before(app, server, compiler) {
  // #region 推荐页
  // 获取 qq music 推荐页 slider信息
  app.get('/getRecomSlider', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  // 获取 qq music 推荐页 recomPlayList信息
  app.get('/getRecomPlayList', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  // 获取 qq music 推荐页 newSong信息
  // 带查询参数 pi ps 页数 及 每页显示数目
  app.get('/getNewSongList', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        const {
          pi,
          ps
        } = JSON.parse(req.query.data).new_song.songlistPage
        const s = (pi - 1) * ps
        const e = pi * ps
        const newSongList = response.data.new_song.data.songlist.slice(s, e)
        return res.json({
          code: 0,
          newSongList
        })
      })
      .catch(e => {
        console.log(e)
      })
  })

  // #endregion

  // #region 歌手详情页
  // 获取 歌手的 song-list信息
  app.get('/getSingerSongList', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        console.log(response)
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  // 获取 歌单的 song-list信息
  app.get('/getAlbumSongList', (req, res) => {
    const albumSongListUrl = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    sendAxiosAjax(albumSongListUrl, req.query)
      .then(response => {
        console.log(response)
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })
  // 获取音乐的vkey
  app.get('/getMusicVkey', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        console.log(response)
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  // 获取音乐的歌词
  app.get('/getLyric', (req, res) => {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })

  // 获取排行榜
  app.get('/getTopList', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })
  // 获取排行榜歌曲
  app.get('/getTopListSongs', (req, res) => {
    sendAxiosAjax(url, req.query)
      .then(response => {
        return res.json(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  })
}
