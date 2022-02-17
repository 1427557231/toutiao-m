<template>
  <van-button
    :class="{'btn-liked': value}"
    :icon="value === 1 ? 'good-job': 'good-job-o'"
    :loading="loading"
    @click="onLike"
  ></van-button>
</template>

<script>
import { addLike, delLike } from '@/api/article.js'

export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      try {
        let status = -1 // 点赞状态
        if (this.value === 1) {
          // 取消点赞
          await delLike(this.articleId)
        } else {
          // 点赞
          await addLike(this.articleId)
          status = 1
        }
        // 更新点赞视图
        this.$emit('input', status)
        // 提示点赞状态
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast('点赞失败')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.btn-liked {
  .van-icon {
  color: #e5645f
  }
}
</style>
