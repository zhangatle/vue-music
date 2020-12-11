<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background" ref="cdWrapper">
          <img :src="currentSong.image" alt="" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{lyricCurrentTxt}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper" :data="currentLyric && currentLyric.lines">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current': currentLineNum === index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.time"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_normalizeSongInterval(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @progressmove="progressmove" />
            </div>
            <span class="time time-r">{{_normalizeSongInterval(currentSong.interval)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" class="icon" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" />
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="playMiniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      ref="audio"
      :src="currentSongUrl"
      @canplay="play"
      @timeupdate="updateCreateTime"
      @ended="audioEnd"
    ></audio>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapMutations} from 'vuex'
  import {prefixStyle} from 'common/js/dom'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import animations from 'create-keyframe-animation'
  import { getSongVkey } from 'api/singer'
  import Lyric from 'lyric-parser'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  export default {
    name: 'player',
    data() {
      return {
        radius: 32,
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        lyricCurrentTxt: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'currentSong',
        'playlist',
        'playing',
        'currentSongUrl',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      playMiniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      percent() {
        return this.currentTime / this.currentSong.interval
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      }
    },
    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setCurrentSongUrl: 'SET_CURRENT_SONG_URL',
        setPlaying: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      middleTouchStart(e) {
        this.touch.inited = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        if (!this.touch.inited) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const innerWidth = window.innerWidth
        const lyricOffsetLeft = this.currentShow === 'cd' ? 0 : -innerWidth
        const offsetWidth = Math.min(
          0,
          Math.max(deltaX + lyricOffsetLeft, -innerWidth)
        )
        this.touch.precent = Math.abs(offsetWidth / innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd() {
        let offsetWidth
        let opacity
        const innerWidth = window.innerWidth
        if (this.currentShow === 'cd') {
          if (this.touch.precent > 0.1) {
            offsetWidth = -innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.precent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = '300ms'
        this.$refs.middleL.style[transitionDuration] = '300ms'
        this.$refs.middleL.style.opacity = opacity
        this.touch.inited = false
      },
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let songList = null
        if (mode === playMode.random) {
          songList = shuffle(this.playlist)
        } else {
          songList = this.sequenceList
        }
        const nowSongIndex = songList.findIndex(song => {
          return song.id === this.currentSong.id
        })
        this.setCurrentIndex(nowSongIndex)
        this.setPlayList(songList)
      },
      open() {
        this.setFullScreen(true)
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
        this.currentTime = 0
      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
        this.currentTime = 0
      },
      play() {
        this.songReady = true
      },
      audioEnd() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
        this.setPlaying(true)
      },
      togglePlaying() {
        this.setPlaying(!this.playing)
        // this.currentLyric.togglePlaying()
      },
      progressmove(percent) {
        const currentTime = this.currentSong.interval * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      back() {
        this.setFullScreen(false)
      },
      updateCreateTime(e) {
        this.currentTime = e.target.currentTime
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: 'translate3d(0,0,0) scale(1.1)'
          },
          100: {
            transform: 'translate3d(0,0,0) scale(1)'
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        const cdWrapper = this.$refs.cdWrapper
        cdWrapper.style.transition = 'all 0.4s'
        cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        cdWrapper.removeEventListener('transitionend', done)
        cdWrapper.addEventListener('transitionend', done)
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        const lyricLines = this.$refs.lyricLine
        if (lineNum > 5) {
          this.$refs.lyricList.scrollToElement(lyricLines[lineNum - 5], 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.lyricCurrentTxt = txt
      },
      getLyric() {
        this.currentSong.getLyric().then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.lyricCurrentTxt = ''
          this.currentLineNum = 0
          this.currentLyric = null
        })
      },
      afterLeave() {
        const cdWrapper = this.$refs.cdWrapper
        cdWrapper.style.transition = ''
        cdWrapper.style[transform] = ''
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const originWidth = window.innerWidth * 0.8
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingBottom - originWidth / 2 - paddingTop
        const scale = targetWidth / originWidth
        return {x, y, scale}
      },
      _normalizeSongInterval(seconds) {
        const mins = `${(seconds / 60) | 0}`
        const secs = `${seconds % 60 | 0}`
        return `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`
      }
    },
    watch: {
      playing(newPlaying) {
        if (!this.songReady) {
          return
        }
        this.$nextTick(() => {
          const audio = this.$refs.audio
          newPlaying ? audio.play() : audio.pause()
        })
      },
      currentSong(newSong) {
        getSongVkey(newSong.mid).then((data) => {
          const currentSongUrl = data.req_0.data.sip[0] + data.req_0.data.midurlinfo[0].purl
          this.setCurrentSongUrl(currentSongUrl)
          if (this.currentLyric) {
            this.currentLyric.stop()
            this.currentLineNum = 0
            this.lyricCurrentTxt = ''
            this.currentTime = 0
          }
          this.$nextTick(() => {
            const audio = this.$refs.audio
            audio.play()
            this.getLyric()
          })
        })
      }
    },
    components: {
      ProgressBar,
      Scroll,
      ProgressCircle
    }
  }
</script>

<style scoped lang="stylus" >
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 36px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active,
      &.normal-leave-active
        transition: all 0.4s
        .top,
        .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter,
      &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active,
      &.mini-leave-active
        transition: all 0.4s
      &.mini-enter,
      &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini,
        .icon-pause-mini,
        .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
