<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，点击重试"
      :immediate-check='false'
      @load="onLoad"
    >
      <CommentItem
        v-for="item,index in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
  name: 'CommentList',
  data () {
    return {
      loading: false,
      finished: false,
      offset: null,
      limit: 10, // 每页评论个数
      error: false
    }
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getComments({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        })
        const { results } = data.data
        // 把文章评论个数传给父组件
        this.$emit('onload-success', data.data)
        this.list.push(...results) // 给父组件的list数据添加评论信息
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.$toast('获取评论失败')
      }
      this.loading = false
    }
  },
  created () {
    // 当你手动初始 onload 的话，它不会自动开始初始化的 loading，所以我们要手动地开启初始 loading
    this.loading = true
    this.onLoad()
  },
  components: {
    CommentItem
  }
}
</script>

<style>
</style>
