<template>
  <m-popup
    style="width: 800px"
    :ok-text="item ? $t('Edit') : $t('Submit')"
    :nameText="item ? $t('Edit UDF Function') : $t('Create UDF Function')"
    @ok="_ok"
    @close="close"
    ref="popup"
  >
    <template slot="content">
      <div class="udf-create-model">
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('type') }}</template>
          <template slot="content">
            <el-radio-group v-model="type" size="mini" style="vertical-align: sub">
              <el-radio :label="'HIVE'">HIVE UDF</el-radio>
              <!--<v-radio :label="'SPARK'">SPARK UDF</v-radio>-->
            </el-radio-group>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('UDF Function Name') }}</template>
          <template slot="content">
            <el-input
              type="input"
              maxlength="40"
              v-model="funcName"
              size="small"
              :placeholder="$t('Please enter a function name')"
            >
            </el-input>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('Package Name') }}</template>
          <template slot="content">
            <el-input
              type="input"
              maxlength="100"
              v-model="className"
              size="small"
              :placeholder="$t('Please enter a Package name')"
            >
            </el-input>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('UDF Resources') }}</template>
          <template slot="content">
            <treeselect
              style="width: 535px; float: left"
              v-model="resourceId"
              maxHeight="200"
              :disable-branch-nodes="true"
              :options="udfResourceList"
              :disabled="isUpdate"
              :normalizer="normalizer"
              :placeholder="$t('Please select UDF resources directory')"
            >
              <div slot="value-label" slot-scope="{ node }">
                {{ node.raw.fullName }}
              </div>
            </treeselect>
            <el-button type="primary" size="small" @click="_toggleUpdate" :disabled="upDisabled">{{
              $t('Upload Resources')
            }}</el-button>
          </template>
        </ListBoxF>
        <ListBoxF v-if="isUpdate">
          <template slot="name"><strong>*</strong>{{ $t('UDF resources directory') }}</template>
          <template slot="content">
            <treeselect
              style="width: 535px; float: left"
              v-model="pid"
              maxHeight="200"
              @select="selTree"
              :options="udfResourceDirList"
              :normalizer="normalizer"
              :placeholder="$t('Please select UDF resources directory')"
            >
              <div slot="value-label" slot-scope="{ node }">
                {{ node.raw.fullName }}
              </div>
            </treeselect>
          </template>
        </ListBoxF>
        <ListBoxF v-if="isUpdate">
          <template slot="name">&nbsp;</template>
          <template slot="content">
            <m-udf-update ref="assignment" @on-update-present="_onUpdatePresent" @on-update="_onUpdate"> </m-udf-update>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name">{{ $t('Instructions') }}</template>
          <template slot="content">
            <el-input
              type="textarea"
              v-model="description"
              size="small"
              :placeholder="$t('Please enter a instructions')"
            >
            </el-input>
          </template>
        </ListBoxF>
      </div>
    </template>
  </m-popup>
</template>
<script>
import _ from 'lodash'
import i18n from '@/module/i18n'
import store from '@/store'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import mPopup from '@/components/popup/popup'
import ListBoxF from '@/components/listBoxF/ListBoxF'
import mUdfUpdate from '@/components/fileUpdate/udfUpdate'

export default {
  name: 'udf-create',
  data() {
    return {
      store,
      type: 'HIVE',
      funcName: '',
      className: '',
      argTypes: '',
      database: '',
      description: '',
      resourceId: null,
      pid: null,
      udfResourceList: [],
      isUpdate: false,
      upDisabled: false,
      normalizer(node) {
        return {
          label: node.name,
        }
      },
    }
  },
  props: {
    item: Object,
  },
  methods: {
    _ok() {
      this.$refs.popup.spinnerLoading = true
      if (this._validation()) {
        this._verifyUdfFuncName()
          .then(() => {
            this._createUdfFunc().then()
          })
          .then(() => {
            setTimeout(() => {
              this.$refs.popup.spinnerLoading = false
            }, 800)
          })
          .catch(() => {
            this.$refs.popup.spinnerLoading = false
          })
      } else {
        this.$refs.popup.spinnerLoading = false
      }
    },
    _createUdfFunc() {
      return new Promise((resolve, reject) => {
        // parameter
        let param = {
          type: this.type, // HIVE,SPARK
          funcName: this.funcName,
          className: this.className,
          argTypes: this.argTypes, // Can not pass this parameter
          database: this.database, // Can not pass this parameter
          description: this.description,
          resourceId: this.resourceId,
        }

        let id = (this.item && this.item.id) || null

        // edit
        if (id) {
          param.id = id
        }
        // api
        this.store
          .dispatch(`resource/${id ? 'updateUdfFunc' : 'createUdfFunc'}`, param)
          .then((res) => {
            this.$emit('onUpdate', param)
            this.$message.success(res.msg)
            resolve()
          })
          .catch((e) => {
            this.$message.error(e.msg || '')
            reject(e)
          })
      })
    },
    _onUpdatePresent() {
      // disabled submit
      this.$refs.popup.apDisabled = true
      // disabled update
      this.upDisabled = true
    },
    // selTree
    selTree(node) {
      this.$refs.assignment.receivedValue(node.id, node.fullName)
    },
    /**
     * get udf resources
     */
    _getUdfList() {
      return new Promise((resolve) => {
        this.store.dispatch('resource/getResourcesList', { type: 'UDF' }).then((res) => {
          let item = res.data
          this.filterEmptyDirectory(item)
          item = this.filterEmptyDirectory(item)
          let item1 = _.cloneDeep(res.data)
          this.diGuiTree(item)

          this.diGuiTree(this.filterJarFile(item1))
          item1 = item1.filter((item) => {
            if (item.dirctory) {
              return item
            }
          })
          this.udfResourceList = item
          this.udfResourceDirList = item1
          resolve()
        })
      })
    },
    // filterEmptyDirectory
    filterEmptyDirectory(array) {
      for (const item of array) {
        if (item.children) {
          this.filterEmptyDirectory(item.children)
        }
      }
      return array.filter(
        (n) => (/\.jar$/.test(n.name) && n.children.length === 0) || (!/\.jar$/.test(n.name) && n.children.length > 0)
      )
    },
    // filterJarFile
    filterJarFile(array) {
      for (const item of array) {
        if (item.children) {
          item.children = this.filterJarFile(item.children)
        }
      }
      return array.filter((n) => !/\.jar$/.test(n.name))
    },
    // diGuiTree
    diGuiTree(item) {
      // Recursive convenience tree structure
      item.forEach((item) => {
        item.children === '' || item.children === undefined || item.children === null || item.children.length === 0
          ? delete item.children
          : this.diGuiTree(item.children)
      })
    },
    /**
     * Upload udf resources
     */
    _onUpdate(o) {
      this.upDisabled = false
      this.udfResourceList.push(o)
      this.isUpdate = false
      this.$nextTick(() => {
        this.resourceId = o.id
      })
      this.$refs.popup.apDisabled = false
    },
    _toggleUpdate() {
      this.isUpdate = !this.isUpdate
      if (this.isUpdate) {
        this.resourceId = null
      }
    },
    /**
     * verification
     */
    _validation() {
      if (!this.funcName) {
        this.$message.warning(`${i18n.$t('Please enter a UDF function name')}`)
        return false
      }
      if (!this.className) {
        this.$message.warning(`${i18n.$t('Please enter a Package name')}`)
        return false
      }
      if (!this.resourceId) {
        this.$message.warning(`${i18n.$t('Select UDF Resources')}`)
        return false
      }
      return true
    },
    /**
     * Verify that the function name exists
     */
    _verifyUdfFuncName() {
      return new Promise((resolve, reject) => {
        if (this.item && this.item.funcName === this.funcName) {
          resolve()
        } else {
          this.store
            .dispatch('resource/verifyUdfFuncName', { name: this.funcName })
            .then(() => {
              resolve()
            })
            .catch((e) => {
              this.$message.error(e.msg || '')
              reject(e)
            })
        }
      })
    },
    close() {
      this.$emit('close')
    },
  },
  created() {
    this._getUdfList().then(() => {
      // edit
      if (this.item) {
        this.type = this.item.type
        this.funcName = this.item.funcName || ''
        this.className = this.item.className || ''
        this.argTypes = this.item.argTypes || ''
        this.database = this.item.database || ''
        this.description = this.item.description || ''
        this.resourceId = this.item.resourceId
      } else {
        this.resourceId = null
      }
    })
  },
  components: { mPopup, ListBoxF, mUdfUpdate, Treeselect },
}
</script>
<style lang="scss" rel="stylesheet/scss">
.vue-treeselect__control {
  height: 32px;
}
</style>
