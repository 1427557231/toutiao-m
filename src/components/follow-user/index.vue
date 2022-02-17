<template>
  <van-button
    class="follow-btn"
    round
    size="small"
    v-if="isFollowed"
    :loading="loading"
    @click="onFollow"
  >已关注</van-button>
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-else
    :loading="loading"
    @click="onFollow"
  >关注</van-button>
</template>

<script>
import { addFollow, delFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed',
    event: 'updateIsFollow'
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
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
    async onFollow () {
      this.loading = true // 展示关注按钮的loading
      try {
        if (this.isFollowed) {
          // 取消关注
          await delFollow(this.userId)
        } else {
          // 要关注
          await addFollow(this.userId)
        }
        // 更新视图状态，通知父组件
        this.$emit('updateIsFollow', !this.isFollowed)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('不能关注自己')
        } else {
          this.$toast('操作失败，请重试')
        }
      }
      this.loading = false
    }
  }
}
</script>

<style>
</style>
