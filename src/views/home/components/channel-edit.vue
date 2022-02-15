<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="btn-edit"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="gird-item"
        v-for="(obj, index) in myChannels"
        :key="index"
        @click="onMyChannels(obj, index)"
      >
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannels.includes(obj.id)"
        ></van-icon>
        <span class="text" slot="text" :class="{ active: index === active }">{{
          obj.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="gird-item"
        :text="item.name"
        v-for="(item, index) in recommendChannels"
        :key="index"
        icon="plus"
        @click="addMyChannels(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getAllChannels, addUserChannel, delUserChannel } from '@/api/channel'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false, // 是否为编辑状态
      fiexdChannels: [0]
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log(data.data.channels)
      } catch (err) {
        this.$toast('数据获取失败')
      }
    },
    async addMyChannels (item) {
      if (this.isEdit) this.myChannels.push(item)
      // 数据持久化处理
      if (this.user) {
        // 已登录，数据放到接口上
        try {
          await addUserChannel({
            id: item.id,
            seq: this.myChannels.length
          })
        } catch (err) {
          this.$toast('提交数据失败')
        }
      } else {
        // 未登录，数据存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannels (obj, index) {
      if (this.isEdit) {
        // 1. 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(obj.id)) return
        // 2. 编辑状态，删除频道
        this.myChannels.splice(index, 1)
        // 3. 如果删除的索引比active小，则让active-1
        if (index < this.active) {
          this.$emit('changeActive', this.active - 1)
        }
        // 4. 处理持久化
        this.deleteChannel(obj)
      } else {
        // 非编辑状态，切换频道
        this.$emit('changeActive', index, false)
      }
    },
    async deleteChannel (channelId) {
      if (this.user) {
        // 已登录，将数据更新到服务器
        await delUserChannel(channelId.id)
      } else {
        // 未登录，将数据保存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  },
  computed: {
    /* recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        const flag = this.myChannels.find((mychannel) => {
          return channel.id === mychannel.id
        })
        if (!flag) {
          channels.push(channel)
        }
      })
      return channels
    } */
    recommendChannels () {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((mychannels) => {
          return mychannels.id === channel.id
        })
      })
    },
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .btn-edit {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .gird-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/ .my-grid {
    .gird-item {
      .van-grid-item__content {
        .van-grid-item__icon-wrapper {
          position: unset;
          .van-icon-clear {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 30px;
            color: #ababab;
            z-index: 2;
            transform: translate(50%, -50%);
          }
        }
      }
    }
  }
  /deep/ .recommend-grid {
    .gird-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          margin-right: 6px;
          font-size: 28px;
        }
      }
    }
  }
}
</style>
