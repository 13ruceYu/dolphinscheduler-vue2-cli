<template>
  <div class="list-model">
    <div class="table-box">
      <el-table :data="list" size="mini" style="width: 100%">
        <el-table-column type="index" :label="$t('#')" width="50"></el-table-column>
        <el-table-column :label="$t('Name')">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.alias }}</p>
              <div slot="reference" class="name-wrapper">
                <a href="javascript:" class="links" @click="_go(scope.row)">{{ scope.row.alias }}</a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="userName" :label="$t('Resource userName')"></el-table-column>
        <el-table-column :label="$t('Whether directory')" width="100">
          <template slot-scope="scope">
            {{ scope.row.directory ? $t('Yes') : $t('No') }}
          </template>
        </el-table-column>
        <el-table-column prop="fileName" :label="$t('File Name')"></el-table-column>
        <el-table-column :label="$t('Description')" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.description | filterNull }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Size')">
          <template slot-scope="scope">
            {{ _rtSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Update Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Operation')" width="150">
          <template slot-scope="scope">
            <el-tooltip :content="$t('Edit')" placement="top">
              <span
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit-outline"
                  @click="_edit(scope.row)"
                  :disabled="_rtDisb(scope.row)"
                  circle
                ></el-button
              ></span>
            </el-tooltip>
            <el-tooltip :content="$t('Rename')" placement="top">
              <span
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="_rename(scope.row, scope.$index)"
                  circle
                ></el-button
              ></span>
            </el-tooltip>
            <el-tooltip :content="$t('Download')" placement="top">
              <span
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-download"
                  @click="_downloadFile(scope.row)"
                  :disabled="scope.row.directory ? true : false"
                  circle
                ></el-button
              ></span>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top">
              <el-popconfirm
                :confirmButtonText="$t('Confirm')"
                :cancelButtonText="$t('Cancel')"
                icon="el-icon-info"
                iconColor="red"
                :title="$t('Delete?')"
                @onConfirm="_delete(scope.row, scope.row.id)"
              >
                <el-button type="danger" size="mini" icon="el-icon-delete" circle slot="reference"></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <RenameDialog :visible.sync="renameDialogVisible" :item="item" @onUpDate="onUpDate"></RenameDialog>
  </div>
</template>
<script>
import _ from 'lodash'
import RenameDialog from './RenameDialog.vue'
import { filtTypeArr } from '../../_source/common'
import { bytesToSize } from '@/util/util'
import { downloadFile } from '@/module/download'
import localStore from '@/util/localStorage'
import { deleteResource } from '@/api/modules/resource'

export default {
  name: 'file-manage-list',
  components: { RenameDialog },
  props: {
    fileResourcesList: Array,
    pageNo: Number,
    pageSize: Number,
  },
  data() {
    return {
      list: [],
      renameDialog: false,
      item: {},
      index: null,
      renameDialogVisible: false,
    }
  },
  watch: {
    fileResourcesList(a) {
      this.list = []
      setTimeout(() => {
        this.list = a
      })
    },
  },
  mounted() {
    this.list = this.fileResourcesList
  },
  methods: {
    _edit(item) {
      localStore.setItem('file', `${item.alias}|${item.size}`)
      this.$router.push({ path: `/resource/file/edit/${item.id}` })
    },
    _go(item) {
      localStore.setItem('file', `${item.alias}|${item.size}`)
      if (item.directory) {
        localStore.setItem('currentDir', `${item.fullName}`)
        this.$router.push({ path: `/resource/file/subdirectory/${item.id}` })
      } else {
        this.$router.push({ path: `/resource/file/list/${item.id}` })
      }
    },
    _downloadFile(item) {
      downloadFile('resources/download', {
        id: item.id,
      })
    },
    _rtSize(val) {
      return bytesToSize(parseInt(val))
    },
    async _delete(item) {
      try {
        await deleteResource({ id: item.id })
        this.$emit('on-update')
        this.$message.success(this.$t('success'))
      } catch (e) {
        this.$message.error(e.msg || '')
      }
    },
    _rename(item, i) {
      this.item = item
      this.index = i
      this.renameDialogVisible = true
    },
    onUpDate(item) {
      this.$set(this.list, this.index, item)
      this.renameDialog = false
    },
    close() {
      this.renameDialog = false
    },
    _rtDisb({ alias, size }) {
      let i = alias.lastIndexOf('.')
      let a = alias.substring(i, alias.length)
      let flag = _.includes(filtTypeArr, _.trimStart(a, '.'))
      if (flag && size < 1000000) {
        flag = true
      } else {
        flag = false
      }
      return !flag
    },
  },
}
</script>
