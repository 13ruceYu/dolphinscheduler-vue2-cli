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
      <template v-if="!fileResourcesList.length && total <= 0">
        <NoData></NoData>
      </template>
      <Spin :is-spin="isLoading" :is-left="isLeft"> </Spin>
    </template>
  </ListConstruction>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import Spin from '@/components/spin/Spin'
import { findComponentDownward } from '@/util/'
import NoData from '@/components/noData/NoData'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'resource-list-index-FILE',
  components: { ListConstruction, Conditions, mList, Spin, NoData },
  mixins: [listUrlParamHandle],
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
    }
  },
  watch: {
    // router
    $route(a) {
      // url no params get instance list
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
    },
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  methods: {
    ...mapActions('resource', ['getResourcesListP']),
    /**
     * File Upload
     */
    _uploading() {
      findComponentDownward(this.$root, 'Nav')._fileUpdate('FILE')
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
    _getList(flag) {
      if (sessionStorage.getItem('isLeft') === 0) {
        this.isLeft = false
      } else {
        this.isLeft = true
      }
      this.isLoading = !flag
      this.getResourcesListP(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.fileResourcesList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    _updateList() {
      this.searchParams.pageNo = 1
      this.searchParams.searchVal = ''
      this._debounceGET()
    },
    _onUpdate() {
      this._debounceGET()
    },
  },
}
</script>
