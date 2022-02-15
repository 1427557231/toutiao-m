<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      :success-text="refreshSuccesText"
      success-duration="700"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <van-cell v-for="obj, index in list" :key="index" :title="obj.title" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isLoading: false, // 控制下拉刷新是否完成
      refreshSuccesText: '刷新成功' // 刷新成功的文本
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1. 请求获取数据
        const {
          data: { data }
        } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now()
        })
        // 模拟随机请求失败的情况
        /* if (Math.random() > 0.5) {
          JSON.parse('fshdifas')
        } */
        // 2. 把请求结果数据放到list数组中
        this.list.push(...data.results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        if (data.results.length) {
          this.timestamp = data.pre_timestamp
        } else {
          // 4. 判断数据是否全部加载完成
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading也要关闭
        this.loading = false
      }
    },
    async onRefresh () {
      try {
        // 请求获取数据
        const {
          data: { data }
        } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now() // 下拉刷新每次使用最新时间戳
        })

        // 模拟随机请求失败的情况
        /* if (Math.random() > 0.5) {
          JSON.parse('fshdifas')
        } */

        // 将数据追加到列表的顶部
        this.list.unshift(...data.results)
        // 更新下拉刷新成功的文本
        this.refreshSuccesText = `刷新成功，更新了${data.results.length}新数据`
        // 关闭下拉刷新的 loading 状态
        this.isLoading = false
      } catch (err) {
        this.refreshSuccesText = '刷新失败，请重试'
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow: auto;
}
</style>
