<template>
  <div>
    <div class="singer" ref="singer">
      <list-view :data="singers" ref="singerList"></list-view>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import {ERR_OK} from 'api/config'
  import {getSinger} from 'api/singer'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'

  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    name: 'singer',
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSinger()
    },
    methods: {
      _getSinger() {
        getSinger().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normallizeSingerData(res.data.list)
          }
        })
      },
      _normallizeSingerData(list) {
        const singer = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, i) => {
            if (i < HOT_SINGER_LEN) {
              singer.hot.items.push(
                new Singer({
                  name: item.Fsinger_name,
                  id: item.Fsinger_mid
                })
              )
            }
            const key = item.Findex
            if (!singer[key]) {
              singer[key] = {
                title: key,
                items: []
              }
            }
            singer[key].items.push(
              new Singer({
                name: item.Fsinger_name,
                id: item.Fsinger_mid
              })
            )
          }
        )
        const hot = []
        const ret = []
        Object.keys(singer).forEach(key => {
          const val = singer[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        })
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return [...hot, ...ret]
      }
    },
    components: {
      ListView
    }
  }
</script>

<style lang='stylus' scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
