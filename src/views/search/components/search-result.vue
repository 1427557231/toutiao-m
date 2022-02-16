<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onLoad"
    >
      <van-cell
        v-for="item,index in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getResults } from '@/api/search.js'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页数
      perPage: 15, // 每页数量
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getResults({
          page: this.page, // 页数
          per_page: this.perPage, // 每页数量
          q: this.searchText // 搜索词
        })
        const results = data.data.results
        this.loading = false
        if (results.length) {
          this.list.push(...results)
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
</style>
