<template>
  <m-popup :ok-text="$t('Rename')" :nameText="$t('Rename')" @ok="_ok" @close="close" :asyn-loading="true">
    <template slot="content">
      <div class="resource-rename-model">
        <ListBoxF>
          <template slot="name"><strong>*</strong>{{ $t('Name') }}</template>
          <template slot="content">
            <el-input type="input" v-model="name" maxlength="60" size="small" :placeholder="$t('Please enter name')">
            </el-input>
          </template>
        </ListBoxF>
        <ListBoxF>
          <template slot="name">{{ $t('Description') }}</template>
          <template slot="content">
            <el-input type="textarea" v-model="description" size="small" :placeholder="$t('Please enter description')">
            </el-input>
          </template>
        </ListBoxF>
      </div>
    </template>
  </m-popup>
</template>
<script>
import i18n from '@/module/i18n'
import store from '@/store'
import mPopup from '@/components/popup/popup'
import ListBoxF from '@/components/listBoxF/ListBoxF'
export default {
  name: 'resource-udf-rename',
  data() {
    return {
      store,
      description: '',
      name: '',
    }
  },
  props: {
    item: Object,
  },
  methods: {
    _ok(fn) {
      this._verification()
        .then(() => {
          if (this.name === this.item.alias) {
            return new Promise((resolve, reject) => {
              this.description === this.item.description ? reject({ msg: '内容未修改' }) : resolve()
            })
          } else {
            return this.store.dispatch('resource/resourceVerifyName', {
              fullName: '/' + this.name,
              type: 'UDF',
            })
          }
        })
        .then(() => {
          return this.store.dispatch('resource/resourceRename', {
            name: this.name,
            description: this.description,
            id: this.item.id,
            type: 'UDF',
          })
        })
        .then((res) => {
          this.$message.success(res.msg)
          this.$emit('onUpDate', res.data)
          fn()
        })
        .catch((e) => {
          fn()
          this.$message.error(e.msg || '')
        })
    },
    _verification() {
      return new Promise((resolve, reject) => {
        if (!this.name) {
          reject({
            // eslint-disable-line
            msg: `${i18n.$t('Please enter resource name')}`,
          })
        } else {
          resolve()
        }
      })
    },
    close() {
      this.$emit('close')
    },
  },
  watch: {},
  created() {
    let item = this.item || {}
    if (item) {
      this.name = item.alias
      this.description = item.description
    }
  },
  mounted() {},
  components: { mPopup, ListBoxF },
}
</script>
