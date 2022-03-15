<template>
  <div class="nav-model">
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
    <div class="right">
      <span class="lang">
        <el-dropdown @command="_toggleLanguage">
          <span class="el-dropdown-link"> {{ activeLocale.name }}<em class="el-icon-arrow-down"></em> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.code" v-for="(item, $index) in localeList" :key="$index">{{
              item.name
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <el-dropdown @command="_toggleUser">
        <span class="el-dropdown-link">
          <em class="el-icon-user-solid"></em>{{ userInfo.userName }}<em class="el-icon-arrow-down"></em>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="user">
            <em class="el-icon-user"></em>
            <span>{{ $t('User Information') }}</span>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <em class="el-icon-switch-button"></em>
            <span>{{ $t('Logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="file-update-model" @click="_toggleArchive" v-if="isUpdate">
      <div class="icon-cloud">
        <em class="ans el-icon-upload"></em>
      </div>
      <div class="progress-box">
        <m-progress-bar :value="progress" text-placement="bottom"></m-progress-bar>
      </div>
    </div>

    <el-dialog :visible.sync="definitionUpdateDialog" append-to-body="true" width="auto">
      <m-definition-update
        :type="type"
        @onProgressDefinition="onProgressDefinition"
        @onUpdateDefinition="onUpdateDefinition"
        @onArchiveDefinition="onArchiveDefinition"
        @closeDefinition="closeDefinition"
      ></m-definition-update>
    </el-dialog>

    <el-dialog :visible.sync="fileUpdateDialog" append-to-body="true" width="auto" destroy-on-close>
      <m-file-update
        :type="type"
        @onProgressFileUpdate="onProgressFileUpdate"
        @onUpdateFileUpdate="onUpdateFileUpdate"
        @onArchiveDefinition="onArchiveFileUpdate"
        @closeFileUpdate="closeFileUpdate"
      ></m-file-update>
    </el-dialog>

    <el-dialog :visible.sync="fileChildUpdateDialog" append-to-body="true" width="auto">
      <m-file-child-update
        :type="type"
        :id="id"
        @onProgressFileChildUpdate="onProgressFileChildUpdate"
        @onUpdateFileChildUpdate="onUpdateFileChildUpdate"
        @onArchiveFileChildUpdate="onArchiveFileChildUpdate"
        @closeFileChildUpdate="closeFileChildUpdate"
      ></m-file-child-update>
    </el-dialog>

    <el-dialog :visible.sync="resourceChildUpdateDialog" append-to-body="true" width="auto">
      <m-resource-child-update
        :type="type"
        :id="id"
        @onProgressResourceChildUpdate="onProgressResourceChildUpdate"
        @onUpdateResourceChildUpdate="onUpdateResourceChildUpdate"
        @onArchiveFileChildUpdate="onArchiveResourceChildUpdate"
        @closeResourceChildUpdate="closeResourceChildUpdate"
      ></m-resource-child-update>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import _ from 'lodash'
import cookies from 'js-cookie'
import { mapState, mapActions } from 'vuex'
import { findComponentDownward } from '@/util/'
import mFileUpdate from '@/components/fileUpdate/fileUpdate'
import mFileChildUpdate from '@/components/fileUpdate/fileChildUpdate'
import mResourceChildUpdate from '@/components/fileUpdate/resourceChildUpdate'
import mDefinitionUpdate from '@/components/fileUpdate/definitionUpdate'
import mProgressBar from '@/components/progressBar/progressBar'
import { findLocale, localeList } from '@/module/i18n/config'
import NavItem from './NavItem.vue'

export default {
  name: 'Nav',
  components: {
    mFileUpdate,
    mProgressBar,
    mDefinitionUpdate,
    mFileChildUpdate,
    mResourceChildUpdate,
    NavItem,
  },
  data() {
    return {
      // Whether to drag
      isDrag: false,
      // Upload progress
      progress: 0,
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
      type: '',
      definitionUpdateDialog: false,
      fileUpdateDialog: false,
      fileChildUpdateDialog: false,
      id: null,
      resourceChildUpdateDialog: false,
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
    /**
     * User Info
     */
    _goAccount() {
      this.isLogin = false
      this.$router.push({ name: 'account' })
    },
    /**
     * _toggle User
     */
    _toggleUser(command) {
      if (command === 'user') {
        this._goAccount()
      } else {
        this._signOut()
      }
    },
    /**
     * Upload (for the time being)
     */
    _fileUpdate(type) {
      if (this.progress) {
        this._toggleArchive()
        return
      }
      this.type = type
      if (this.type === 'DEFINITION') {
        this.definitionUpdateDialog = true
      } else {
        this.fileUpdateDialog = true
      }
    },
    onProgressDefinition(val) {
      this.progress = val
    },
    onUpdateDefinition() {
      let self = this
      findComponentDownward(self.$root, 'definition-list-index')._updateList()
      this.isUpdate = false
      this.progress = 0
      this.definitionUpdateDialog = false
    },
    onArchiveDefinition() {
      this.isUpdate = true
    },
    closeDefinition() {
      this.progress = 0
      this.definitionUpdateDialog = false
    },
    onProgressFileUpdate(val) {
      this.progress = val
    },
    onUpdateFileUpdate() {
      let self = this
      findComponentDownward(self.$root, `resource-list-index-${this.type}`)._updateList()
      this.isUpdate = false
      this.progress = 0
      this.fileUpdateDialog = false
    },
    onArchiveFileUpdate() {
      this.isUpdate = true
    },
    closeFileUpdate() {
      this.progress = 0
      this.fileUpdateDialog = false
    },
    _fileChildUpdate(type, data) {
      if (this.progress) {
        this._toggleArchive()
        return
      }
      this.type = true
      this.id = data
      this.fileChildUpdateDialog = true
    },
    onProgressFileChildUpdate(val) {
      this.progress = val
    },
    onUpdateFileChildUpdate() {
      let self = this
      findComponentDownward(self.$root, `resource-list-index-${this.type}`)._updateList()
      this.isUpdate = false
      this.progress = 0
      this.fileChildUpdateDialog = false
    },
    onArchiveFileChildUpdate() {
      this.isUpdate = true
    },
    closeFileChildUpdate() {
      this.progress = 0
      this.fileChildUpdateDialog = false
    },
    _resourceChildUpdate(type, data) {
      if (this.progress) {
        this._toggleArchive()
        return
      }
      this.type = type
      this.id = data
      this.resourceChildUpdateDialog = true
    },
    onProgressResourceChildUpdate(val) {
      this.progress = val
    },
    onUpdateResourceChildUpdate() {
      let self = this
      findComponentDownward(self.$root, `resource-list-index-${this.type}`)._updateList()
      this.isUpdate = false
      this.progress = 0
      this.resourceChildUpdateDialog = false
    },
    onArchiveResourceChildUpdate() {
      this.isUpdate = true
    },
    closeResourceChildUpdate() {
      this.progress = 0
      this.resourceChildUpdateDialog = false
    },
    _toggleArchive() {
      $('.update-file-modal').show()
    },
    _signOut() {
      this.signOut()
    },
    _toggleLanguage(language) {
      console.log(language)
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
  position: relative;
  .m-title-box {
    text-align: center;
    .logo-m {
      width: 36px;
      height: 36px;
      margin: 0 auto;
      position: relative;
      top: 12px;
    }
  }
  .el-dropdown {
    color: #fff;
    font-size: 14px;
    vertical-align: middle;
    line-height: 60px;
    margin-right: 25px;
  }
  .logo-box {
    position: absolute;
    left: 10px;
    top: 8px;
    cursor: pointer;
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
    position: absolute;
    left: 220px;
    top: 0;
  }
  .right {
    position: absolute;
    right: 0;
    top: 0;
    .ans-poptip {
      min-width: 120px;
    }
    > .lang {
      .ans-poptip {
        min-width: 80px;
      }
    }
    > .docs {
      padding-right: 20px;
      a {
        color: #fff;
        font-size: 14px;
        vertical-align: middle;
        &:hover {
          color: #2d8bf0;
        }
      }
    }
    .current-project {
      height: 60px;
      line-height: 56px;
      display: inline-block;
      margin-right: 16px;
      cursor: pointer;
      i {
        font-size: 18px;
        vertical-align: middle;
        &:nth-child(1) {
          font-size: 20px;
          color: #2d8cf0;
        }
      }
      span {
        color: #333;
        vertical-align: middle;
        font-size: 14px;
      }
      &:hover {
        span {
          color: #2d8cf0;
        }
      }
    }
    .login-model {
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      margin-top: 16px;
      em {
        font-size: 18px;
        vertical-align: middle;
        color: #fff;
      }
      span {
        color: #fff;
        vertical-align: middle;
        font-size: 14px;
      }
      &:hover {
        > i,
        > span {
          color: #2d8cf0;
        }
      }
    }
    .lrns-list {
      margin: -6px 0;
      a {
        display: block;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        &:hover {
          i,
          span {
            color: #2d8cf0;
          }
        }
      }
    }
  }
  .file-update-model {
    cursor: pointer;
    .progress-box {
      width: 240px;
    }
    .icon-cloud {
      position: absolute;
      left: -34px;
      top: 2px;
      > i {
        font-size: 22px;
        color: #2d8cf0;
      }
    }
  }
}
</style>
