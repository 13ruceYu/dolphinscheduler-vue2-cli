<template>
  <div class="nav-model">
    <div class="left">
      <router-link :to="{ path: '/home' }" tag="div" class="logo-box">
        <a href="javascript:"></a>
      </router-link>
      <div class="nav-box">
        <NavItem path="/home" iconClass="ansfont ri-home-4-line" title="Home"></NavItem>
        <NavItem path="/projects" iconClass="ansiconfont el-icon-tickets" title="Project Manage"></NavItem>
        <NavItem path="/dataQuality" iconClass="ansiconfont el-icon-document-checked" title="DataQuality"></NavItem>
        <NavItem path="/resource" iconClass="ansiconfont el-icon-folder" title="Resources manage"></NavItem>
        <NavItem path="/dataSource" iconClass="ansfont ri-database-2-line" title="Datasource manage"></NavItem>
        <NavItem path="/monitor" iconClass="ansiconfont el-icon-monitor" title="Monitor"></NavItem>
        <NavItem path="/security" iconClass="ansfont ri-shield-check-line" title="Security"></NavItem>
      </div>
    </div>
    <div class="right">
      <span class="lang">
        <el-dropdown @command="_toggleLanguage">
          <span class="el-dropdown-link">
            {{ activeLocale.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.code" v-for="(item, $index) in localeList" :key="$index">{{
              item.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <el-dropdown @command="_toggleUser">
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>{{ userInfo.userName }}<i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">
            <i class="el-icon-user"></i>
            <span>{{ $t('User Information') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="el-icon-switch-button"></i>
            <span>{{ $t('Logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import cookies from 'js-cookie'
import { mapState, mapActions } from 'vuex'
import { findLocale, localeList } from '@/module/i18n/config'
import NavItem from './NavItem.vue'

export default {
  name: 'Nav',
  components: {
    NavItem,
  },
  data() {
    return {
      // Whether to upload
      isUpdate: false,
      // Whether to log in
      isLogin: false,
      // Take the language list data to get rid of the language pack
      localeList: _.map(_.cloneDeep(localeList()), (v) => _.omit(v, ['locale'])),
      // Selected language
      activeLocale: '',
      // Environmental variable
      docLink: '',
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  created() {
    let language = cookies.get('language')
    this.activeLocale = language ? findLocale(language) : '中文'
    this.docLink = process.env.NODE_ENV === 'true' ? 'docs' : `/view/docs/${this.activeLocale.code}/_book` // eslint-disable-line
  },
  methods: {
    ...mapActions('user', ['signOut']),
    _goAccount() {
      this.isLogin = false
      this.$router.push({ name: 'account' })
    },
    _toggleUser(command) {
      if (command === 'user') {
        this._goAccount()
      } else {
        this._signOut()
      }
    },
    _signOut() {
      this.signOut()
    },
    _toggleLanguage(language) {
      cookies.set('language', language, { path: '/' })
      setTimeout(() => {
        window.location.reload()
      }, 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-model {
  height: 60px;
  background: #2d303a;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    align-items: center;
    .logo-box {
      cursor: pointer;
      margin-left: 10px;
      > a {
        width: 180px;
        height: 46px;
        display: block;
        background: url('../../assets/logo.svg') no-repeat;
      }
    }
    .nav-box {
      height: 60px;
      line-height: 60px;
      margin-left: 20px;
    }
  }
  .right {
    .el-dropdown-link {
      color: #fff;
      cursor: pointer;
      margin-right: 20px;
      &:hover {
        color: #478ce9;
      }
    }
  }
}
</style>
