<template>
  <van-button
    :class="{'btn-collected': isCollected}"
    :icon="isCollected ? 'star': 'star-o'"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addCollected, delCollected } from '@/api/article.js'

export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'updateIsCollected'
  },
  props: {
    isCollected: {
      type: Boolean,
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
    async onCollect () {
      this.loading = true
      try {
        if (this.isCollected) {
          //  取消收藏
          await delCollected(this.articleId)
        } else {
          //  要收藏
          await addCollected(this.articleId)
        }
        // 自定义事件修改数据不是立即执行的
        this.$emit('updateIsCollected', !this.isCollected)
        // 提示收藏情况
        this.$toast.success(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast('搜藏失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.btn-collected {
  .van-icon{
  color:  #ffa500 ;
  }
}
</style>
