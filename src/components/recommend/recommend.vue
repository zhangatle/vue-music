<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" @pullingUp="pullingUp" :listenPullingUp="listenPullingUp" :pullUpLoad="pullUpLoad" :data="data">
      <div>
        <div v-if="sliderItems.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in sliderItems" :key="item.id">
              <a :href="['https://y.qq.com/n/yqq/album/' + item.jump_info.url + '.html']">
                <img :src="item.pic_info.url" alt="" class="needsclick" @load="loadImg">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul class="recommend-wrapper">
            <li v-for="item in recomPlaylist" class="recommend-item" :key="item.content_id" @click="selectAlbum(item)">
              <div class="icon">
                <img v-lazy="item.cover">
              </div>
              <div class="text" v-html="item.title"></div>
            </li>
          </ul>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">最新音乐</h1>
          <ul>
            <li v-for="(item, index) in newSongList" class="item" :key="item.id" @click="selectSong(item, index)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.image" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.name"></h2>
                <p class="desc" v-html="item.singer"></p>
              </div>
<!--              <div class="interval">{{_normalizeSongInterval(item.interval)}}</div>-->
            </li>
          </ul>
          <loading class="newsong-loading" v-show="newSongLoading && !isNewSongBottom" />
          <p class="recommend-bottom" v-show="isNewSongBottom">——我也是有底线的——</p>
        </div>
      </div>
      <div class="loading-container" v-show="!recomPlaylist.length">
        <loading />
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSlider, getRecommend, getNewSongList} from 'api/recommend'
  import {createSong} from 'common/js/song'
  import Loading from 'base/loading/loading'
  import {mapActions, mapMutations} from 'vuex'
  import {ERR_OK} from 'api/config'
  import Slider from 'base/slider/slider'
  import Scroll from 'base/scroll/scroll'
  import {playlistMixin} from 'common/js/mixin'

  export default {
    name: 'Recommend',
    mixins: [playlistMixin],
    data() {
      return {
        sliderItems: [], // 轮播图信息
        recomPlaylist: [], // 推荐歌单信息
        newSongList: [], // 新歌列表
        newSongListPageIndex: 0,
        newSongLoading: false,
        isNewSongBottom: false,
        listenPullingUp: true,
        pullUpLoad: {
          threshold: 20
        }
      }
    },
    created() {
      this._getSlider()
      this._getRecommend()
      this._getNewSongList()
    },
    methods: {
      ...mapMutations({
        setAlbum: 'SET_ALBUM'
      }),
      ...mapActions(['selectPlay']),
      selectSong(song, index) {
        this.selectPlay({
          list: this.newSongList,
          index
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : 0
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getSlider() {
        getSlider().then((res) => {
          if (res.code === ERR_OK) {
            this.sliderItems = res.focus.data.content
          }
        })
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recomPlaylist = res.recomPlaylist.data.v_hot.slice(0, 9)
          }
        })
      },
      _getNewSongList() {
        this.newSongListPageIndex++
        this.newSongLoading = true
        getNewSongList(this.newSongListPageIndex).then((res) => {
          if (res.code === ERR_OK) {
            if (res.newSongList && res.newSongList.length > 0) {
              const list = this._normalizeSong(res.newSongList)
              this.newSongList = [...this.newSongList, ...list]
              this.newSongLoading = false
            } else {
              this.isNewSongBottom = true
            }
          }
        })
      },
      _normalizeSong(list) {
        const songs = []
        list.forEach(song => {
          songs.push(createSong(song))
        })
        return songs
      },
      loadImg() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      selectAlbum(item) {
        this.$router.push({
          path: `recommend/${item.content_id}`
        })
        this.setAlbum(item)
      },
      _normalizeSongInterval(seconds) {
        const mins = `${Math.floor(seconds / 60)}`
        const secs = `${seconds % 60}`
        return `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`
      },
      pullingUp() {
        this._getNewSongList()
      }
    },
    computed: {
      data() {
        return [...this.newSongList, ...this.recomPlaylist]
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .recommend-wrapper
          display: flex
          flex-wrap: wrap
          justify-content: space-between
          .recommend-item
            flex: 1 0 30%
            display: flex
            flex-direction: column
            justify-content: flex-start
            align-items: center
            margin: 5px
            .icon
              flex: 0 0 80px
              width: 100%
              img
                width: 100%
            .text
              line-height: 1.2
              overflow: hidden
              text-overflow: ellipsis
              display: -webkit-box
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
              font-size: $font-size-medium
              color: $color-theme
              .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
              no-wrap()
            .desc
              display: -webkit-box
              -webkit-line-clamp: 2
              -webkit-box-orient: vertical
              color: $color-text-d
              no-wrap()
          .interval
            flex: 0 0 50px
            text-align: center
            align-self: center
            color: $color-text-ll
            font-size: $font-size-small
            margin-left: 10px
        .loading-container
          position: absolute
          width: 100%
          top: 50%
          transform: translateY(-50%)
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
      .recommend-bottom
        text-align: center
        color: $color-text-d
        font-size: $font-size-medium
        height: 40px
        line-height: 40px
</style>
