<template>
  <ListConstruction :title="$t('File Manage')">
    <template slot="conditions">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group">
          <el-button-group size="small">
            <el-button size="mini" @click="() => $router.push({ name: 'resource-file-createFolder' })">{{
              $t('Create folder')
            }}</el-button>
            <el-button size="mini" @click="() => $router.push({ name: 'resource-file-create' })">{{
              $t('Create File')
            }}</el-button>
            <el-button size="mini" @click="_uploading">{{ $t('Upload Files') }}</el-button>
          </el-button-group>
        </template>
      </Conditions>
    </template>
    <template slot="content">
      <template v-if="fileResourcesList.length || total > 0">
        <m-list
          @on-update="_onUpdate"
          :file-resources-list="fileResourcesList"
          :page-no="searchParams.pageNo"
          :page-size="searchParams.pageSize"
        >
        </m-list>
        <div class="page-box">
          <el-pagination
            background
            @current-change="curPageChange"
            @size-change="pageSizeChange"
            :page-size="searchParams.pageSize"
            :current-page.sync="searchParams.pageNo"
            :page-sizes="[10, 30, 50]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </template>
      <NoData v-else></NoData>
      <Spin :is-spin="isLoading" :is-left="isLeft"> </Spin>
      <FileUploadDialog :visible.sync="fileUploadShow" :type="'FILE'" @uploadFileSuccess="_getList"></FileUploadDialog>
    </template>
  </ListConstruction>
</template>
<script>
import _ from 'lodash'
import mList from './_source/list'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'
import { getResourceListPage } from '@/api/modules/resource'
import FileUploadDialog from '@/components/fileUploadDialog/FileUploadDialog.vue'

export default {
  name: 'resource-list-index-FILE',
  components: { ListConstruction, Conditions, mList, Spin, NoData, FileUploadDialog },
  data() {
    return {
      total: null,
      isLoading: false,
      fileResourcesList: [],
      searchParams: {
        id: -1,
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
        type: 'FILE',
      },
      isLeft: true,
      fileUploadShow: false,
    }
  },
  watch: {
    searchParams: {
      handler() {
        this._getList()
      },
      deep: true,
    },
  },
  mounted() {
    this._getList()
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  methods: {
    _uploading() {
      this.fileUploadShow = true
    },
    _onConditions(o) {
      this.searchParams = _.assign(this.searchParams, o)
    },
    curPageChange(val) {
      this.searchParams.pageNo = val
    },
    pageSizeChange(val) {
      this.searchParams.pageSize = val
    },
    async _getList(flag) {
      sessionStorage.getItem('isLeft') === 0 ? (this.isLeft = false) : (this.isLeft = true)
      this.isLoading = !flag
      try {
        const res = await getResourceListPage(this.searchParams)
        if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
          this.searchParams.pageNo = this.searchParams.pageNo - 1
        } else {
          this.fileResourcesList = res.totalList
          this.total = res.total
        }
      } catch (e) {
        this.$message.error(e || '')
      }
      this.isLoading = false
    },
    _updateList() {
      this.searchParams.pageNo = 1
      this.searchParams.searchVal = ''
      this._getList()
    },
    _onUpdate() {
      this._getList()
    },
  },
}
</script>
