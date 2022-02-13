<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>
    <!-- / 导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        type="number"
        name="mobile"
        maxlength="11"
        v-model="user.mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        type="number"
        name="code"
        maxlength="6"
        v-model="user.code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        @click="onSendSms"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000*60"
            format="sss"
            @finish="countDownFinish"
          />
          <van-button
            v-else
            native-type="button"
            class="btn-send-sms"
            round
            size="small"
            type="default"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="btn-login-wrap">
        <van-button class="btn-login" block type="info" native-type="submit">登录</van-button>
      </div>
      <p class="title">账号：13911111111 密码：246810</p>
    </van-form>
    <!-- / 登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          {
            pattern: /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,
            message: '手机号格式不正确'
          }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}/, message: '验证码格式不正确' }
        ]
      },
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit () {
      // 1. 获取表单数据
      const user = this.user
      // 2. 表单验证。在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 如果为0则持续展示
      })
      // 3. 提交表单请求登录
      try {
        const res = await login(user)
        // console.log(res.data.data, '登录成功')
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功!', res.data.data)
        this.$router.back()
        // this.$router.push('/my')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误!')
        } else {
          this.$toast.fail('登录失败，请稍后再试!')
        }
      }
      // 4. 根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1. 校验手机号码
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return false
      }
      // 2. 验证通过，开启倒计时
      this.isCountDownShow = true
      // 3. 请求，发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功!')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后再试')
        } else {
          this.$toast('发送失败，请稍后再试')
        }
      }
    },
    countDownFinish () {
      this.isCountDownShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .btn-send-sms {
    width: 152px;
    height: 46px;
    line-height: 1;
    background-color: #efefef;
    font-size: 22px;
    color: #666;
  }
  .btn-login-wrap {
    padding: 53px 33px;
    .btn-login {
      background-color: #64b4fb;
      border: none;
    }
  }
  .title {
    text-align: center;
    color: #aaa;
  }
}
</style>
