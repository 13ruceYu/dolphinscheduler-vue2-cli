<template>
  <Popover
    ref="popover"
    :nameText="item ? $t('Edit') : $t('Create Project')"
    :ok-text="item ? $t('Edit') : $t('Submit')"
    @close="_close"
    @ok="_ok"
  >
    <template slot="content">
      <div class="projects-create-model">
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('Project Name') }}</template>
          <template slot="content">
            <el-input
              v-model="projectName"
              :placeholder="$t('Please enter name')"
              maxlength="60"
              size="small"
              type="input"
            >
            </el-input>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name">{{ $t('Description') }}</template>
          <template slot="content">
            <el-input v-model="description" :placeholder="$t('Please enter description')" size="small" type="textarea">
            </el-input>
          </template>
        </ListBoxF>
      </div>
    </template>
  </Popover>
</template>
<script>
import _ from 'lodash'
import i18n from '@/module/i18n'
import store from '@/store'
import Popover from '@/components/popup/Popover'
import ListBoxF from '@/components/listBoxF/ListBoxF'

export default {
  name: 'CreateProject',
  components: { Popover, ListBoxF },
  props: {
    item: Object,
  },
  data() {
    return {
      store,
      description: '',
      projectName: '',
    }
  },
  created() {
    if (this.item) {
      this.projectName = this.item.name
      this.description = this.item.description
    }
  },
  methods: {
    _ok() {
      if (!this._verification()) {
        return
      }

      let param = {
        projectName: _.trim(this.projectName),
        description: _.trim(this.description),
      }

      // edit
      if (this.item) {
        param.projectId = this.item.id
      }

      this.$refs.popover.spinnerLoading = true

      this.store
        .dispatch(`projects/${this.item ? 'updateProjects' : 'createProjects'}`, param)
        .then((res) => {
          this.$emit('_onUpdate')
          this.$message({
            message: res.msg,
            type: 'success',
            offset: 70,
          })
          this.$refs.popover.spinnerLoading = false
        })
        .catch((e) => {
          this.$message.error(e.msg || '')
          this.$refs.popover.spinnerLoading = false
        })
    },
    _close() {
      this.$emit('close')
    },
    _verification() {
      if (!this.projectName) {
        this.$message.warning(`${i18n.$t('Please enter name')}`)
        return false
      }
      return true
    },
  },
}
</script>
