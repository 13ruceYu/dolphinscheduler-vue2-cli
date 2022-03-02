<template>
  <ListConstruction :title="$t('Create folder')">
    <template slot="content">
      <div class="resource-create-model">
        <m-list-box-f>
          <template slot="name"> <strong>*</strong>{{ $t('Folder Name') }} </template>
          <template slot="content">
            <el-input
              v-model="name"
              type="input"
              maxlength="60"
              style="width: 300px"
              size="small"
              :placeholder="$t('Please enter name')"
            />
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name">
            {{ $t('Description') }}
          </template>
          <template slot="content">
            <el-input
              v-model="description"
              type="textarea"
              style="width: 430px"
              size="small"
              :placeholder="$t('Please enter description')"
            />
          </template>
        </m-list-box-f>
        <m-list-box-f>
          <template slot="name"> &nbsp; </template>
          <template slot="content">
            <div class="submit">
              <el-button type="primary" size="mini" round :loading="spinnerLoading" @click="ok()">
                {{ spinnerLoading ? 'Loading...' : $t('Create') }}
              </el-button>
              <el-button type="text" size="mini" @click="() => $router.push({ name: 'file' })">
                {{ $t('Cancel') }}
              </el-button>
            </div>
          </template>
        </m-list-box-f>
      </div>
    </template>
  </ListConstruction>
</template>
<script>
import i18n from '@/module/i18n'
import { mapActions } from 'vuex'
import { filtTypeArr } from '../_source/common'
import mListBoxF from '@/components/listBoxF/ListBoxF'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'ResourceListCreateFILE',
  components: { ListConstruction, mListBoxF },
  props: {},
  data() {
    return {
      type: '',
      name: '',
      description: '',
      folderList: filtTypeArr,
      spinnerLoading: false,
    }
  },
  methods: {
    ...mapActions('resource', ['createResourceFolder']),
    ok() {
      if (this._validation()) {
        this.spinnerLoading = true
        this.createResourceFolder({
          type: 'FILE',
          name: this.name,
          currentDir: '/',
          pid: -1,
          description: this.description,
        })
          .then((res) => {
            this.$message.success(res.msg)
            setTimeout(() => {
              this.spinnerLoading = false
              this.$router.push({ path: '/resource/file' })
            }, 800)
          })
          .catch((e) => {
            this.$message.error(e.msg || '')
            this.spinnerLoading = false
          })
      }
    },
    _validation() {
      if (!this.name) {
        this.$message.warning(`${i18n.$t('Please enter resource folder name')}`)
        return false
      }

      return true
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.resource-create-model {
  padding: 30px;
}
</style>
