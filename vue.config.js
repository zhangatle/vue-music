'use strict'
const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: path.resolve(__dirname, '../dist'),
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('common', path.join(__dirname, 'src/common'))
      .set('components', path.join(__dirname, 'src/components'))
      .set('api', path.join(__dirname, 'src/api'))
      .set('base', path.join(__dirname, 'src/base'))
  },
  devServer: {
    proxy: {
      "/api":{
        target: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/api': ''
        }
      },
      "/v8":{
        target: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/v8': ''
        }
      },
      "/getAlbumSongList":{
        target: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/getAlbumSongList': ''
        },
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        },
        ws:true,
      },
      "/lyric":{
        target: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: {
          '^/lyric': ''
        },
        headers: {
          referer: 'https://c.y.qq.com/',
          host: 'c.y.qq.com'
        },
        ws:true,
      }
    }
  }
}
