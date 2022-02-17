<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
      @click-right="$emit('close')"
    >
      <van-icon
        slot="right"
        name="cross"
      />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment"></CommentItem>
      <!-- 当前评论项 -->

      <!-- 评论的回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <CommentList
      :list="commentList"
        :source="comment.com_id"
        type="c"
      ></CommentList>
      <!-- 评论的回复列表 -->
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button
        class="post-btn"
        size="small"
        round
        @click="isPostShow = true"
      >
        写评论
      </van-button>
    </div>
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
    <CommentPost :target="comment.com_id" @post-success="onPostSucccess"></CommentPost>
    </van-popup>
    <!-- / 发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'

export default {
  name: 'CommentReply',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSucccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新的回复内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>
