<template>
  <div class="search-container">
    <!-- 搜索栏 start -->
    <form
      class="search-from"
      action="/"
    >
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      >
      </van-search>
    </form>
    <!-- 搜索栏 end -->

    <!-- 搜索结果 start -->
    <SearchResult
      v-if="isResultShow"
      :searchText="searchText"
    ></SearchResult>
    <!-- 搜索结果 end -->

    <!-- 联想建议 start -->
    <SearchSuggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></SearchSuggestion>
    <!-- 联想建议 end -->

    <!-- 搜索历史记录 start -->
    <SearchHistory
      v-else
      :searchHistories="searchHistories"
      @search="onSearch"
    ></SearchHistory>
    <!-- 搜索历史记录 end -->
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'

export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: [] // 搜索的历史记录数据
    }
  },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索历史记录
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-from {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
