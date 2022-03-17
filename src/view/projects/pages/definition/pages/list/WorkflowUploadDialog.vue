<template>
  <el-dialog :title="$t('File Upload')" :visible="visible" :showClose="false" width="35%" destroy-on-close>
    <div class="content-container">
      <el-form label-width="80px">
        <el-form-item :label="$t('Upload Files')" required>
          <el-upload :auto-upload="false" :on-change="fileChange" :before-upload="beforeFileUpload">
            <el-button slot="trigger" size="small" plain>
              {{ $t('Upload') }}<i class="el-icon-upload el-icon--right"></i
            ></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('File Name')" required>
          <el-input
            type="input"
            v-model="name"
            :disabled="progress !== 0"
            size="small"
            :placeholder="$t('Please enter name')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">{{ $t('Cancel') }}</el-button>
      <el-button size="medium" type="primary" :loading="btnLoading" @click="uploadFile">{{ $t('Upload') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { uploadWorkflow } from '@/api/modules/projects'
export default {
  name: 'WorkflowUploadDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: '',
      file: '',
      progress: 0,
      btnLoading: false,
    }
  },
  methods: {
    beforeFileUpload(file) {
      const isLt1024M = file.size / 1024 / 1024 < 1024
      if (!isLt1024M) {
        this.$message.warning(`${this.$t('Upload File Size')}`)
      }
      return isLt1024M
    },
    fileChange(file, fileList) {
      const { name, raw } = file
      fileList.length > 1 && fileList.splice(0, 1)
      this.name = name
      this.file = raw
    },
    async uploadFile() {
      if (this._validation()) {
        this.btnLoading = true
        try {
          let formData = new FormData()
          formData.append('file', this.file)
          formData.append('projectName', this.$store.state.dag.projectName)
          await uploadWorkflow(formData)
          this.$message.success(this.$t('success'))
          this.$emit('uploadFileSuccess')
          this.close()
        } catch (e) {
          this.$message.error(e || '')
        }
      }
      this.btnLoading = false
    },
    _validation() {
      if (!this.name) {
        this.$message.warning(`${this.$t('Please enter file name')}`)
        return false
      }
      if (!this.file) {
        this.$message.warning(`${this.$t('Please select the file to upload')}`)
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

<style lang="scss" scoped>
.content-container {
  padding: 10px;
}
</style>
