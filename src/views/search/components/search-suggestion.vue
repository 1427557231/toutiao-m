<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestion"
      :key="index"
      icon="search"
      @click="$emit('search', text)"
    >
      <div
        slot="title"
        v-html="hightlight(text)"
      ></div>
    </van-cell>
  </div>
</template>

<script>
import { getSuggestions } from '@/api/search.js'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestion: []
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      immediate: true,
      handler: debounce(function (value) {
        this.loadSuggestion(value)
      }, 200)
    }
  },
  methods: {
    async loadSuggestion (q) {
      try {
        const { data } = await getSuggestions(q)
        if (data.data.options[0] !== null) {
          this.suggestion = data.data.options
        }
      } catch (err) {
        this.$toast('数据获取失败，请稍后再试')
      }
    },
    hightlight (text) {
      const hightlightStr = `<span class="hightlight">${this.searchText}</span>`
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, hightlightStr)
    }
  }
}
</script>

<style lang="less">
.search-suggestion {
  span.hightlight {
    color: red;
  }
}
</style>
