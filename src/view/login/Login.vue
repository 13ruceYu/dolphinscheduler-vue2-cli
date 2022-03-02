<template>
  <div class="login-container">
    <div class="login-model">
      <div class="logo">
        <a href="javascript:"></a>
      </div>
      <div class="form-model">
        <div class="list">
          <label>{{ $t('User Name') }}</label>
          <div>
            <el-input
              v-model.trim="userName"
              type="text"
              :placeholder="$t('Please enter user name')"
              maxlength="60"
              @keyup.enter.native="handleLogin"
            >
            </el-input>
          </div>
          <p v-if="isUserPassword" class="error">
            {{ userNameText }}
          </p>
        </div>
        <div class="list">
          <label>{{ $t('Password') }}</label>
          <div>
            <el-input
              v-model="userPassword"
              type="password"
              :placeholder="$t('Please enter your password')"
              maxlength="20"
              @keyup.enter.native="handleLogin"
            >
            </el-input>
          </div>
          <p v-if="isUserPassword" class="error">
            {{ userPasswordText }}
          </p>
        </div>
        <div class="list" style="margin-top: 10px">
          <el-button style="width: 365px" type="primary" round :loading="spinnerLoading" long @click="handleLogin"
            >{{ spinnerLoading ? 'Loading...' : ` ${$t('Login')} ` }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import i18n from '@/module/i18n'
import cookies from 'js-cookie'
import { login } from '@/api/modules/login'
import { getUserInfo } from '@/api/modules/user'
import { mapMutations } from 'vuex'
import localStore from '@/util/localStorage'

export default {
  name: 'Login',
  data() {
    return {
      spinnerLoading: false,
      userName: '',
      userPassword: '',
      isUserName: false,
      isUserPassword: false,
      userNameText: '',
      userPasswordText: '',
    }
  },
  watch: {
    userName() {
      this.isUserName = false
    },
    userPassword() {
      this.isUserPassword = false
    },
  },
  methods: {
    ...mapMutations('user', ['setUserInfo']),
    async handleLogin() {
      if (this.validate()) {
        this.spinnerLoading = true
        try {
          const { sessionId } = await login({
            userName: this.userName,
            userPassword: this.userPassword,
          })
          sessionStorage.setItem('sessionId', sessionId)
          cookies.set('sessionId', sessionId, { path: '/' })
          const userInfo = await getUserInfo()
          this.setUserInfo(userInfo)
          localStore.setJSON('user', userInfo)
          if (this.userName === 'admin') {
            this.$router.push('/security/tenant')
          } else {
            this.$router.push('/home')
          }
        } catch (err) {
          this.userPasswordText = err
          this.isUserPassword = true
        }
        this.spinnerLoading = false
      }
    },
    validate() {
      let flag = true
      if (!this.userName) {
        this.userNameText = `${i18n.$t('Please enter user name')}`
        this.isUserName = true
        flag = false
      }
      if (!this.userPassword) {
        this.userPasswordText = `${i18n.$t('Please enter your password')}`
        this.isUserPassword = true
        flag = false
      }
      return flag
    },
  },
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.login-container {
  background-color: #0098e1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  .login-model {
    width: 400px;
    min-height: 260px;
    background: #fff;
    border-radius: 3px;
    z-index: 1;
    box-shadow: 0px 2px 25px 0px rgba(0, 0, 0, 0.3);
    .logo {
      padding-top: 30px;
      margin-bottom: -6px;
      a {
        width: 280px;
        height: 60px;
        display: block;
        background: url('img/login-logo.svg') no-repeat 23px;
        margin: 0 auto;
      }
    }
    .form-model {
      padding: 30px 20px;
      .list {
        margin-bottom: 24px;
        > label {
          font-size: 14px;
          display: block;
          height: 24px;
          line-height: 24px;
          font-weight: normal;
          color: #333;
        }
        > .error {
          font-size: 12px;
          color: #ff0000;
          padding-top: 6px;
        }
        &:last-child {
          margin-bottom: 6px;
        }
      }
    }
    .ctr {
      width: 400px;
      text-align: center;
      position: absolute;
      left: 0;
      bottom: -80px;
      color: #fff;
    }
  }
}
</style>
