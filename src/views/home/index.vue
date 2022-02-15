<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar">
      <van-button
        class="btn-search"
        slot="title"
        type="info"
        size="small"
        round
        text="搜索"
      >
        <i slot="icon" class="toutiao toutiao-sousuo"></i>
      </van-button>
    </van-nav-bar>
    <!-- / 导航栏 -->

    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="obj.name" v-for="obj in channels" :key="obj.id">
        <!-- 文章列表 -->
        <article-list :channel="obj"></article-list>
        <!-- / 文章列表 -->
      </van-tab>

      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="btn-more" @click="isChennelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- / 频道列表 -->
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
    >
      <ChannelEdit
        :my-channels="channels"
        :active="active"
        @changeActive="changeActive"
      ></ChannelEdit
    ></van-popup>
    <!-- / 频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { getItem } from '@/utils/storage'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: null,
      isChennelEditShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          this.channels = data.data.channels
        } else {
          // 未登录，判断是否有本地数据
          if (getItem('TOUTIAO_CHANNELS')) {
            this.channels = getItem('TOUTIAO_CHANNELS')
          } else {
            const { data } = await getUserChannels()
            this.channels = data.data.channels
          }
        }
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    changeActive (index, isChennelEditShow = true) {
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .page-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    /deep/ .van-nav-bar__title {
      max-width: unset;
    }
    .btn-search {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      i.toutiao-sousuo {
        font-size: 32px;
      }
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
      z-index: 1;
      .van-tab {
        min-width: 200px;
        border-right: 1px solid #edeff3;
        font-size: 30px;
        color: #777;
      }
      .van-tab--active {
        color: #333;
      }
      .van-tabs__nav {
        padding-bottom: 0;
        .van-tabs__line {
          bottom: 8px !important;
          width: 31px;
          height: 6px;
          background-color: #3296fa;
        }
      }
      .placeholder {
        flex-shrink: 0;
        width: 66px;
        height: 82px;
      }
      .btn-more {
        position: fixed;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 66px;
        height: 82px;
        background-color: rgba(255, 255, 255, 0.902);
        i.toutiao {
          font-size: 33px;
        }
        &::before {
          content: "";
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background-image: url("~@/assets/gradient-gray-line.png");
          background-size: contain;
        }
      }
    }
  }
}
</style>
