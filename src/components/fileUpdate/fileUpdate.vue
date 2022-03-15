<template>
  <m-popup
    ref="popup"
    :ok-text="$t('Upload')"
    :nameText="$t('File Upload')"
    @ok="_ok"
    @close="close"
    :disabled="progress === 0 ? false : true"
  >
    <template slot="content">
      <form name="files" enctype="multipart/form-data" method="post">
        <div class="file-update-model" id="file-update-model">
          <ListBoxF>
            <template slot="name"><strong>*</strong>{{ $t('File Name') }}</template>
            <template slot="content">
              <el-input
                type="input"
                v-model="name"
                :disabled="progress !== 0"
                size="small"
                :placeholder="$t('Please enter name')"
              >
              </el-input>
            </template>
          </ListBoxF>
          <ListBoxF>
            <template slot="name">{{ $t('Description') }}</template>
            <template slot="content">
              <el-input
                type="textarea"
                v-model="description"
                :disabled="progress !== 0"
                size="small"
                :placeholder="$t('Please enter description')"
              >
              </el-input>
            </template>
          </ListBoxF>
          <ListBoxF>
            <template slot="name"><strong>*</strong>{{ $t('Upload Files') }}</template>
            <template slot="content">
              <div class="file-update-box">
                <el-upload :auto-upload="false" :on-change="fileChange" :before-upload="beforeFileUpload">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
              </div>
            </template>
          </ListBoxF>
        </div>
      </form>
    </template>
  </m-popup>
</template>
<script>
import i18n from '@/module/i18n'
import mPopup from '@/components/popup/popup'
import ListBoxF from '@/components/listBoxF/ListBoxF'
import { verifyResourceName, uploadResource } from '@/api/modules/resource'

export default {
  name: 'file-update',
  components: { mPopup, ListBoxF },
  props: {
    type: String,
  },
  data() {
    return {
      name: '',
      description: '',
      progress: 0,
      file: '',
      currentDir: '/',
      pid: -1,
    }
  },
  methods: {
    beforeFileUpload(file) {
      const isLt1024M = file.size / 1024 / 1024 < 1024
      if (!isLt1024M) {
        this.$message.warning(`${i18n.$t('Upload File Size')}`)
      }
      return isLt1024M
    },
    fileChange(file, fileList) {
      const { name, raw } = file
      fileList.length > 1 && fileList.splice(0, 1)
      this.name = name
      this.file = raw
    },
    async _ok() {
      this.$refs.popup.spinnerLoading = true
      if (this._validation()) {
        try {
          await verifyResourceName({
            fullName: '/' + this.name,
            type: this.type,
          })
          let formData = new FormData()
          formData.append('file', this.file)
          formData.append('type', this.type)
          formData.append('name', this.name)
          formData.append('pid', this.pid)
          formData.append('currentDir', this.currentDir)
          formData.append('description', this.description)
          await uploadResource(formData)
          this.$message.success(i18n.$t('success'))
          this.$emit('onUpdateFileUpdate')
        } catch (e) {
          this.$message.error(e || '')
          this.$refs.popup.spinnerLoading = false
        }
      } else {
        this.$refs.popup.spinnerLoading = false
      }
    },
    resetForm() {
      this.name = ''
      this.description = ''
      this.file = ''
    },
    _validation() {
      if (!this.name) {
        this.$message.warning(`${i18n.$t('Please enter file name')}`)
        return false
      }
      if (!this.file) {
        this.$message.warning(`${i18n.$t('Please select the file to upload')}`)
        return false
      }
      return true
    },
    close() {
      this.$emit('closeFileUpdate')
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.file-update-model {
  .hide-archive {
    position: absolute;
    right: 22px;
    top: 17px;
    .fa,
    .ans {
      font-size: 16px;
      color: #333;
      font-weight: normal;
      cursor: pointer;
      &:hover {
        color: #0097e0;
      }
    }
  }
  .file-update-box {
    padding-top: 4px;
    position: relative;
    .file-update {
      width: 70px;
      height: 40px;
      position: absolute;
      left: 0;
      top: 0;
      cursor: pointer;
      filter: alpha(opacity=0);
      -moz-opacity: 0;
      opacity: 0;
    }
    &:hover {
      .v-btn-dashed {
        background-color: transparent;
        border-color: #47c3ff;
        color: #47c3ff;
        cursor: pointer;
      }
    }
  }
}
</style>
