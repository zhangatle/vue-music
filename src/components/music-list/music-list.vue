<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length>0" @click="randomPlaySong">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs" :rank="rank" @select="selectSong"></song-list>
      </div>
      <div class="loading-container" v-show="!songs || !songs.length">
        <loading />
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Loading from 'base/loading/loading'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  const TITLE_HEIGHT = 40 // 标题高度
  const transform = prefixStyle('transform') // transform 添加css前缀
  let minTranslateY = 0 // 歌单滚动最小坐标 Y
  let imgHeight = 0 // 背景图片高度
  export default {
    name: 'music-list',
    props: {
      title: {
        type: String,
        default: ''
      },
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: null
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.listenScroll = true
      this.probeType = 3
    },
    mounted() {
      imgHeight = this.$refs.bgImage.clientHeight
      this.$refs.list.$el.style.top = `${imgHeight}px`
      minTranslateY = -imgHeight + TITLE_HEIGHT
    },
    methods: {
      ...mapActions(['selectPlay', 'randomPlay']),
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      randomPlaySong() {
        this.randomPlay({list: this.songs})
      },
      selectSong(song, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    watch: {
      scrollY(newY) {
        let zIndex = 0
        let percent = 0
        // 设定scroll的上限
        const transformY = Math.max(newY, minTranslateY)
        this.$refs.layer.style[transform] = `translate3d(0,${transformY}px,0)`
        // scroll移动至上限后，后面scroll部分在图片之下
        if (newY < minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLE_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = '0'
          this.$refs.playBtn.style.display = 'block'
        }
        // 当scroll向下移动，图片放大
        if (newY > 0) {
          percent = Math.abs(newY / imgHeight)
          zIndex = 10
        }
        this.$refs.bgImage.style[transform] = `scale(${1 + percent})`
        this.$refs.bgImage.style['zIndex'] = zIndex
      }
    },
    components: {
      SongList,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
