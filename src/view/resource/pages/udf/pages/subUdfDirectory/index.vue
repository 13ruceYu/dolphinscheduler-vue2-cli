<template>
  <div class="home-main list-construction-model">
    <div class="content-title">
      <a class="bread" style="padding-left: 15px" @click="() => $router.push({ path: `/resource/udf` })">{{
        $t('UDF Resources')
      }}</a>
      <a class="bread" v-for="(item, $index) in breadList" :key="$index" @click="_ckOperation($index)">{{
        '>' + item
      }}</a>
    </div>
    <div class="conditions-box">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group">
          <el-button-group size="small">
            <el-button size="mini" @click="() => $router.push({ name: 'resource-udf-subCreateUdfFolder' })">{{
              $t('Create folder')
            }}</el-button>
            <el-button size="mini" @click="_uploading">{{ $t('Upload UDF Resources') }}</el-button>
          </el-button-group>
        </template>
      </Conditions>
    </div>
    <div class="list-box">
      <template v-if="udfResourcesList.length || total > 0">
        <m-list
          @on-update="_onUpdate"
          :udf-resources-list="udfResourcesList"
          :page-no="searchParams.pageNo"
          :page-size="searchParams.pageSize"
        >
        </m-list>
        <div class="page-box">
          <el-pagination
            background
            @current-change="_page"
            @size-change="_pageSize"
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
      <FileChildUploadDialog
        :visible.sync="fileChildUploadDialogVisible"
        :type="'UDF'"
        :id="searchParams.id"
        @uploadFileSuccess="_getList"
      ></FileChildUploadDialog>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import mList from './_source/list'
import localStore from '@/util/localStorage'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import Conditions from '@/components/conditions/Conditions'
import { getResourceListPage, getResourceId } from '@/api/modules/resource'
import FileChildUploadDialog from '@/components/fileChildUploadDialog/FileChildUploadDialog.vue'

export default {
  name: 'resource-list-index-UDF',
  components: { Conditions, mList, Spin, NoData, FileChildUploadDialog },
  data() {
    return {
      total: null,
      isLoading: false,
      udfResourcesList: [],
      searchParams: {
        id: this.$route.params.id,
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
        type: 'UDF',
      },
      isLeft: true,
      breadList: [],
      fileChildUploadDialogVisible: false,
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
    let dir = localStore.getItem('currentDir').split('/')
    dir.shift()
    this.breadList = dir
    this._getList()
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  methods: {
    _uploading() {
      this.fileChildUploadDialogVisible = true
    },
    _onConditions(o) {
      this.searchParams = _.assign(this.searchParams, o)
      this.searchParams.pageNo = 1
    },
    _page(val) {
      this.searchParams.pageNo = val
    },
    _pageSize(val) {
      this.searchParams.pageSize = val
    },
    _onUpdate() {
      this.searchParams.id = this.$route.params.id
      this._getList()
    },
    _updateList() {
      this.searchParams.id = this.$route.params.id
      this.searchParams.pageNo = 1
      this.searchParams.searchVal = ''
      this._getList()
    },
    async _getList(flag) {
      sessionStorage.getItem('isLeft') === 0 ? (this.isLeft = false) : (this.isLeft = true)
      this.isLoading = !flag
      try {
        const res = await getResourceListPage(this.searchParams)
        if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
          this.searchParams.pageNo = this.searchParams.pageNo - 1
        } else {
          this.udfResourcesList = []
          this.udfResourcesList = res.totalList
          this.total = res.total
        }
      } catch (e) {
        this.$message.error(e || '')
      }
      this.isLoading = false
    },
    _ckOperation(index) {
      let breadName = ''
      this.breadList.forEach((item, i) => {
        if (i <= index) {
          breadName = breadName + '/' + item
        }
      })
      this.transferApi(breadName)
    },
    async transferApi(api) {
      try {
        const res = await getResourceId({
          type: 'UDF',
          fullName: api,
        })
        localStore.setItem('currentDir', `${res.fullName}`)
        this.$router.push({ path: `/resource/udf/subUdfDirectory/${res.id}` })
      } catch (e) {
        this.$message.error(e || '')
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.bread {
  font-size: 22px;
  padding-top: 10px;
  color: #2a455b;
  display: inline-block;
  cursor: pointer;
}
</style>
