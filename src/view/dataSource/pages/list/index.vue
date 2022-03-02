<template>
  <ListConstruction :title="$t('Datasource')">
    <template slot="conditions">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group">
          <el-button size="mini" @click="_create('')">{{ $t('Create Datasource') }}</el-button>
          <el-dialog
            :title="item ? $t('Edit') + $t('Datasource') : $t('Create') + $t('Datasource')"
            v-if="dialogVisible"
            :visible.sync="dialogVisible"
            width="auto"
            :append-to-body="true"
          >
            <m-create-data-source :item="item" @onUpdate="onUpdate" @close="close"></m-create-data-source>
          </el-dialog>
        </template>
      </Conditions>
    </template>
    <template slot="content">
      <template v-if="datasourcesList.length || total > 0">
        <m-list
          @on-update="_onUpdate"
          :datasources-list="datasourcesList"
          :page-no="searchParams.pageNo"
          :page-size="searchParams.pageSize"
        ></m-list>
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
      <template v-if="!datasourcesList.length && total <= 0">
        <NoData></NoData>
      </template>
      <Spin :is-spin="isLoading" :is-left="false"> </Spin>
    </template>
  </ListConstruction>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import mCreateDataSource from './_source/createDataSource'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'datasource-indexP',
  components: {
    mList,
    Conditions,
    Spin,
    ListConstruction,
    NoData,
    mCreateDataSource,
  },
  data() {
    return {
      // loading
      isLoading: true,
      // Total number of articles
      total: 20,
      // data sources(List)
      datasourcesList: [],
      searchParams: {
        // Number of pages per page
        pageSize: 10,
        // Number of pages
        pageNo: 1,
        // Search value
        searchVal: '',
      },
      dialogVisible: false,
      item: {},
    }
  },
  mixins: [listUrlParamHandle],
  methods: {
    ...mapActions('datasource', ['getDatasourcesListP']),
    /**
     * create data source
     */
    _create(item) {
      this.item = item
      this.dialogVisible = true
    },
    onUpdate() {
      this._debounceGET('false')
      this.dialogVisible = false
    },
    close() {
      this.dialogVisible = false
    },
    /**
     * page
     */
    _page(val) {
      this.searchParams.pageNo = val
    },
    _pageSize(val) {
      this.searchParams.pageSize = val
    },
    /**
     * conditions event
     */
    _onConditions(o) {
      this.searchParams = _.assign(this.searchParams, o)
      this.searchParams.pageNo = 1
    },
    /**
     * get data(List)
     */
    _getList(flag) {
      this.isLoading = !flag
      this.getDatasourcesListP(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.datasourcesList = []
            this.datasourcesList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch((e) => {
          this.isLoading = false
        })
    },
    _onUpdate() {
      this._debounceGET('false')
    },
  },
  watch: {
    // router
    $route(a) {
      // url no params get instance list
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
    },
  },
}
</script>
