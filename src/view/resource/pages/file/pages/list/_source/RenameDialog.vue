<template>
  <el-dialog :title="$t('Rename')" :visible="visible" :showClose="false" width="35%" destroy-on-close>
    <div class="content-container">
      <el-form label-width="80px">
        <el-form-item :label="$t('File Name')" required>
          <el-input type="input" v-model="name" size="small" :placeholder="$t('Please enter name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Description')">
          <el-input type="textarea" v-model="description" size="small" :placeholder="$t('Please enter description')">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t('Cancel') }}</el-button>
      <el-button size="medium" type="primary" :loading="btnLoading" @click="ok">{{ $t('Rename') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { renameResource, verifyResourceName } from '@/api/modules/resource'

export default {
  name: 'RenameDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: Object,
  },
  data() {
    return {
      btnLoading: false,
      description: '',
      name: '',
    }
  },
  watch: {
    item(newVal) {
      let item = newVal || {}
      if (item) {
        this.name = item.alias
        this.description = item.description
      }
    },
  },
  methods: {
    async ok() {
      this.btnLoading = true
      try {
        if (!this.name) {
          throw this.$t('Please enter resource name')
        }
        if (this.name === this.item.alias && this.description === this.item.description) {
          throw '内容未修改'
        }
        await verifyResourceName({
          fullName: '/' + this.name,
          type: 'FILE',
        })
        const res = await renameResource({
          name: this.name,
          description: this.description,
          id: this.item.id,
          type: 'FILE',
        })
        this.$emit('onUpDate', res)
        this.$message.success(this.$t('success'))
        this.close()
      } catch (e) {
        this.$message.error(e || '')
      }
      this.btnLoading = false
    },
    close() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
