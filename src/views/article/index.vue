<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.push({name: 'home'})"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div
        class="loading-wrap"
        v-if="loading"
      >
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div
        class="article-detail"
        v-else-if="article.title"
      >
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell
          class="user-info"
          center
          :border="false"
        >
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div
            slot="title"
            class="user-name"
          >{{ article.aut_name }}</div>
          <div
            slot="label"
            class="publish-date"
          >{{ article.pubdate | relativeTime  }}</div>

          <!-- 当我们传递给子组件的数据，既要使用，还要修改
            传递：props
            :isFollow="article.is_followed"
            修改：自定义事件
            @updataIsFollowed="article.is_followed=$event"
            简写方式：在组件上使用 v-model，vue会默认在内部按下面处理
            value="article.is_followed"
            @input="article.is_followed=$event"

            如果修改 v-model 的规则名称，可以通过子组件的 model 属性来配置修改

            一个组件上只能使用一次 v-model
            如果有多个数据需要实现类似于 v-model 的效果，可以使用属性的 .sync 修饰符
          -->
          <FollowUser
            class="follow-btn"
            v-model="article.is_followed"
            :userId="article.aut_id"
          >
          </FollowUser>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
          >写评论</van-button>
          <div class="blank"></div>
          <van-button
            icon="comment-o"
            :badge="article.comm_count"
            color="#777"
          />
          <CollectArticle
            class="btn-item"
            v-model="article.is_collected"
            :articleId="article.art_id"
          />
          <LikeArticle
            class="btn-item"
            v-model="article.attitude"
            :articleId="article.art_id"
          />
          <van-button
            icon="share"
            color="#777777"
          />
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div
        class="error-wrap"
        v-else-if="errStatus === 404"
      >
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div
        class="error-wrap"
        v-else
      >
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user/index.vue'
import CollectArticle from '@/components/collect-article/index.vue'
import LikeArticle from '@/components/like-article/index.vue'

export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章的信息
      loading: true, // 文件加载的状态
      errStatus: 0, // 失败的状态码
      followLoading: false // 关注按钮加载状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // 初始化所有图片点击预览功能，需要利用计时器等页面数据渲染好再获取，因为页面渲染不是立即的
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) this.errStatus = 404
        console.log('获取文章失败')
      }
      // 关闭加载状态，无论成功还是失败
      this.loading = false
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content'] // 将文章内容的标签拿到
      const imgs = articleContent.querySelectorAll('img') // 对文章内容标签进行筛选，选出所有img标签
      const images = [] // 定义一个记录文章所有图片地址的数组
      imgs.forEach((img, index) => {
        // 遍历每个img标签
        images.push(img.src) // 将每个img标签的地址添加到images数组中
        img.onclick = () => {
          // 对每个img标签绑定点击事件
          ImagePreview({
            images, // 预览的图片地址数组
            startPosition: index // 预览图片的起始位置
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .blank {
      flex: 1;
    }
    .comment-btn {
      width: 320px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .comment-icon {
      margin-left: 30px;
    }

    .btn-item {
      border: none;
      border-top: 1px solid #d8d8d8;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
