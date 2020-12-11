<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {ERR_OK} from 'api/config'
  import {getSingerSongList} from 'api/singer'
  import {createSong} from '../../common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    name: 'singer-detail',
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters({
        singer: 'singer'
      })
    },
    created() {
      this._getSingerSongList()
    },
    data() {
      return {
        songs: []
      }
    },
    methods: {
      _getSingerSongList() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerSongList(this.singer).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.singerSongList.data.songList)
          }
        })
      },
      _normalizeSong(list) {
        const songs = []
        list.forEach(song => {
          songs.push(createSong(song.songInfo))
        })
        return songs
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style lang='stylus' scoped>
  @import '~common/stylus/variable'
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter,
  .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
