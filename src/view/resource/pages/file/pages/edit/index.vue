<template>
  <ListConstruction :title="$t('File Details')">
    <div slot="content" style="margin: 20px">
      <div class="file-edit-content">
        <h2>
          <span>{{ name }}</span>
        </h2>
        <template>
          <div v-show="isViewType">
            <template v-if="!msg">
              <div class="code-mirror-model">
                <textarea id="code-edit-mirror" name="code-edit-mirror"></textarea>
              </div>
              <div class="submit-c">
                <el-button type="text" @click="close()" :disabled="disabled" size="small">
                  {{ $t('Return') }}
                </el-button>
                <el-button type="primary" :loading="spinnerLoading" @click="ok()" round size="small"
                  >{{ spinnerLoading ? 'Loading...' : $t('Save') }}
                </el-button>
              </div>
            </template>
            <NoData :msg="msg" v-if="msg"></NoData>
          </div>
        </template>
        <template v-if="!isViewType">
          <m-no-type></m-no-type>
        </template>
      </div>
      <Spin :is-spin="isLoading"> </Spin>
    </div>
  </ListConstruction>
</template>
<script>
import _ from 'lodash'
import { filtTypeArr } from '../_source/common'
import mNoType from '../details/_source/noType'
import { bytesToSize } from '@/util/util'
import codemirror from '../_source/codemirror'
import Spin from '@/components/spin/Spin'
import localStore from '@/util/localStorage'
import NoData from '@/components/noData/NoData'
import { handlerSuffix } from '../details/_source/utils'
import ListConstruction from '@/components/listConstruction/ListConstruction'
import { getResourceContent, updateResourceContent } from '@/api/modules/resource'

let editor

export default {
  name: 'file-details',
  components: { ListConstruction, mNoType, Spin, NoData },
  data() {
    return {
      name: '',
      isViewType: true,
      isLoading: false,
      filtTypeArr: filtTypeArr,
      loadingIndex: 0,
      mode: 'python',
      isData: true,
      size: null,
      spinnerLoading: false,
      msg: '',
    }
  },
  created() {
    let file = _.split(localStore.getItem('file'), '|', 2)
    let fileName = file[0]
    let fileSize = file[1]
    let i = fileName.lastIndexOf('.')
    let a = fileName.substring(i, fileName.length)
    this.mode = handlerSuffix[a]
    this.size = bytesToSize(parseInt(fileSize))
    this.isViewType = _.includes(this.filtTypeArr, _.trimStart(a, '.'))
  },
  mounted() {
    if (this.isViewType) {
      this.getViewResources()
    }
  },
  destroyed() {
    if (editor) {
      editor.toTextArea()
      editor.off('keypress', this.keypress)
    }
  },
  methods: {
    async ok() {
      if (this._validation()) {
        this.spinnerLoading = true
        try {
          await updateResourceContent({
            id: this.$route.params.id,
            content: editor.getValue(),
          })
          this.$message.success(this.$t('success'))
          setTimeout(() => {
            this.spinnerLoading = false
            this.close()
          }, 800)
        } catch (e) {
          this.$message.error(e || '')
        }
        this.spinnerLoading = false
      }
    },
    _validation() {
      if (editor.doc.size > 3000) {
        this.$message.warning(`${this.$t('Resource content cannot exceed 3000 lines')}`)
        return false
      }
      return true
    },
    close() {
      this.$router.go(-1)
    },
    async getViewResources() {
      this.isLoading = true
      try {
        const res = await getResourceContent({
          id: this.$route.params.id,
          skipLineNum: 0,
          limit: 3000,
        })
        this.name = res.alias.split('.')[0]
        if (!res) {
          this.isData = false
        } else {
          this.isData = true
          let content = res.content ? res.content + '\n' : ''
          this._handlerEditor().setValue(content)
        }
      } catch (e) {
        this.msg = e || 'error'
        this.$message.error(e || '')
      }
      this.isLoading = false
    },
    /**
     * Processing code highlighting
     */
    _handlerEditor() {
      // editor
      editor = codemirror('code-edit-mirror', {
        mode: this.mode,
        readOnly: false,
      })

      this.keypress = () => {
        if (!editor.getOption('readOnly')) {
          editor.showHint({
            completeSingle: false,
          })
        }
      }

      // Monitor keyboard
      editor.on('keypress', this.keypress)

      return editor
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.file-edit-content {
  width: 100%;
  background: #fff;
  padding-bottom: 20px;
  > h2 {
    line-height: 60px;
    text-align: center;
    padding-bottom: 6px;
    position: relative;
    .down {
      position: absolute;
      right: 0;
      top: 0;
      > i {
        font-size: 20px;
        color: #2d8cf0;
        cursor: pointer;
        vertical-align: middle;
      }
      em {
        font-size: 12px;
        font-style: normal;
        vertical-align: middle;
        color: #777;
        margin-left: -2px;
      }
    }
  }
  .code-mirror-model {
    height: calc(100vh - 300px);
    .cm-s-mdn-like.CodeMirror {
      height: calc(100vh - 310px);
    }
  }

  .submit-c {
    text-align: center;
    padding-top: 12px;
  }
}
.file-operation {
  padding: 30px 0;
  text-align: center;
}
</style>
