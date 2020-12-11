<template>
<transition name="slide">
  <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank" />
</transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import { mapGetters } from 'vuex'
  import { getTopListSongs } from 'api/rank'
  import { ERR_OK } from 'api/config'
  import { createSong } from 'common/js/song'
  export default {
    created() {
      this._getTopListSongs()
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters(['top']),
      title() {
        return this.top.title
      },
      bgImage() {
        return this.top.mbFrontPicUrl
      }
    },
    methods: {
      _getTopListSongs() {
        if (!this.top.topId) {
          this.$router.push('/rank')
          return
        }
        getTopListSongs(this.top.topId).then((res) => {
          if (res.code === ERR_OK) {
            const { data: topSongList } = res.detail
            this.songs = this._normalizeSong(topSongList.songInfoList)
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

<style lang='stylus' scoped>
  @import '~common/stylus/variable';

  .slide-enter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter,
  .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
