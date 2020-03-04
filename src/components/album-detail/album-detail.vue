<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {getAlbumSongList} from 'api/singer'

  export default {
    name: 'album-detail',
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.album.title
      },
      bgImage() {
        return this.album.cover
      },
      ...mapGetters({
        album: 'album'
      })
    },
    created() {
      this._getAlbumSongList()
    },
    methods: {
      _getAlbumSongList() {
        if (!this.album.content_id) {
          this.$router.push('/recommend')
          return
        }
        getAlbumSongList(this.album.content_id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSong(list) {
        const songs = []
        list.forEach(song => {
          songs.push(createSong(song))
        })
        return songs
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
  .slide-entter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter,
  .slide-leave-tot
    transform: translate3d(100%, 0, 0)
</style>
