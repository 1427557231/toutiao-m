<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDel">
        <span @click="$emit('searchClear')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDel = false">完成</span>
      </div>
      <van-icon
        name="delete-o"
        v-else
        @click="isDel = true"
      />
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon
        name="close"
        v-if="isDel"
      ></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDel: false
    }
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick (val, index) {
      if (this.isDel) {
        this.searchHistories.splice(index, 1)
      } else {
        this.$emit('search', val)
      }
    }
  }
}
</script>

<style>
</style>
