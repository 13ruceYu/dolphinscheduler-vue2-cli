<template>
  <div class="list-model">
    <div class="table-box">
      <el-table :data="list" size="mini" style="width: 100%">
        <el-table-column type="index" :label="$t('#')" min-width="120"></el-table-column>
        <el-table-column :label="$t('UDF Function Name')">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.funcName }}</p>
              <div slot="reference" class="name-wrapper">
                <a href="javascript:" class="links">{{ scope.row.funcName }}</a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="className" :label="$t('Class Name')" min-width="120"></el-table-column>
        <el-table-column prop="type" :label="$t('type')"></el-table-column>
        <el-table-column :label="$t('Description')" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.description | filterNull }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="resourceName" :label="$t('Jar Package')" min-width="150"></el-table-column>
        <el-table-column :label="$t('Update Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Operation')" min-width="100">
          <template slot-scope="scope">
            <el-tooltip :content="$t('Rename')" placement="top" :enterable="false">
              <span
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit-outline"
                  @click="_edit(scope.row)"
                  circle
                ></el-button
              ></span>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top" :enterable="false">
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
    <CreateUdfDialog :item="item" :visible.sync="createUdfDialogVisible" @onSuccess="onUpdate"></CreateUdfDialog>
  </div>
</template>

<script>
import { deleteUdf } from '@/api/modules/resource'
import CreateUdfDialog from './CreateUdfDialog.vue'

export default {
  name: 'udf-manage-list',
  components: { CreateUdfDialog },
  props: {
    udfFuncList: Array,
    pageNo: Number,
    pageSize: Number,
  },
  data() {
    return {
      list: [],
      spinnerLoading: false,
      createUdfDialog: false,
      item: {},
      createUdfDialogVisible: false,
    }
  },
  watch: {
    udfFuncList(a) {
      this.list = []
      setTimeout(() => {
        this.list = a
      })
    },
  },
  mounted() {
    this.list = this.udfFuncList
  },
  methods: {
    async _delete(item) {
      this.spinnerLoading = true

      try {
        await deleteUdf({ id: item.id })
        this.$emit('on-update')
        this.$message.success(this.$t('success'))
      } catch (e) {
        this.$message.error(e || '')
      }

      this.spinnerLoading = false
    },
    _edit(item) {
      this.item = item
      this.createUdfDialogVisible = true
    },
    onUpdate() {
      this.$emit('on-update')
      this.createUdfDialog = false
    },
    close() {
      this.createUdfDialog = false
    },
  },
}
</script>
