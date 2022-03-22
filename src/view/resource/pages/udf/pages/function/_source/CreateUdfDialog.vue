<template>
  <el-dialog
    :title="item ? $t('Edit UDF Function') : $t('Create UDF Function')"
    :visible="visible"
    :showClose="false"
    width="50%"
    destroy-on-close
  >
    <el-form label-width="120px">
      <el-form-item :label="$t('type')" required>
        <el-radio-group v-model="type" size="mini">
          <el-radio :label="'HIVE'">HIVE UDF</el-radio>
          <!--<v-radio :label="'SPARK'">SPARK UDF</v-radio>-->
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('UDF Function Name')" required>
        <el-input
          type="input"
          maxlength="40"
          v-model="funcName"
          size="small"
          :placeholder="$t('Please enter a function name')"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('Package Name')" required>
        <el-input
          type="input"
          maxlength="100"
          v-model="className"
          size="small"
          :placeholder="$t('Please enter a Package name')"
        >
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('UDF Resources')" required>
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
      </el-form-item>
      <el-form-item :label="$t('Instructions')">
        <el-input type="textarea" v-model="description" size="small" :placeholder="$t('Please enter a instructions')">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t('Cancel') }}</el-button>
      <el-button size="medium" type="primary" :loading="btnLoading" @click="_ok">{{ $t('Upload') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'lodash'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getResourcesList, createUdfFunc, updateUdfFunc, verifyUdfFuncName } from '@/api/modules/resource'

export default {
  name: 'CreateUdfDialog',
  components: { Treeselect },
  props: {
    item: Object,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
      btnLoading: false,
    }
  },
  watch: {
    item(newVal) {
      if (newVal) {
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
    },
  },
  async mounted() {
    await this._getUdfList()
  },
  methods: {
    async _ok() {
      if (this._validation()) {
        try {
          await verifyUdfFuncName({ name: this.funcName })
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
            await updateUdfFunc(param)
          } else {
            await createUdfFunc(param)
          }
          this.close()
          this.$emit('onSuccess', param)
          this.$message.success(this.$t('success'))
        } catch (e) {
          this.$message.error(e || '')
        }
      }
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
    async _getUdfList() {
      try {
        const res = await getResourcesList({ type: 'UDF' })
        let item = res
        this.filterEmptyDirectory(item)
        item = this.filterEmptyDirectory(item)
        let item1 = _.cloneDeep(res)
        this.diGuiTree(item)

        this.diGuiTree(this.filterJarFile(item1))
        item1 = item1.filter((item) => {
          if (item.dirctory) {
            return item
          }
        })
        this.udfResourceList = item
        this.udfResourceDirList = item1
      } catch (e) {
        console.log(e)
      }
    },
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
    filterJarFile(array) {
      for (const item of array) {
        if (item.children) {
          item.children = this.filterJarFile(item.children)
        }
      }
      return array.filter((n) => !/\.jar$/.test(n.name))
    },
    diGuiTree(item) {
      // Recursive convenience tree structure
      item.forEach((item) => {
        item.children === '' || item.children === undefined || item.children === null || item.children.length === 0
          ? delete item.children
          : this.diGuiTree(item.children)
      })
    },
    _validation() {
      if (!this.funcName) {
        this.$message.warning(`${this.$t('Please enter a UDF function name')}`)
        return false
      }
      if (!this.className) {
        this.$message.warning(`${this.$t('Please enter a Package name')}`)
        return false
      }
      if (!this.resourceId) {
        this.$message.warning(`${this.$t('Select UDF Resources')}`)
        return false
      }
      return true
    },
    close() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.vue-treeselect__control {
  height: 32px;
}
</style>
