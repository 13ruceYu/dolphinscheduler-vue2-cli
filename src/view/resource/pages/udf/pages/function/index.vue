<template>
  <ListConstruction :title="$t('UDF Function')">
    <template slot="conditions">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group">
          <el-button-group>
            <el-button size="mini" @click="_create">{{ $t('Create UDF Function') }}</el-button>
          </el-button-group>
        </template>
      </Conditions>
    </template>
    <template slot="content">
      <template v-if="udfFuncList.length || total > 0">
        <m-list
          :udf-func-list="udfFuncList"
          :page-no="searchParams.pageNo"
          :page-size="searchParams.pageSize"
          @on-update="_updateList"
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
      <Spin :is-spin="isLoading" :is-left="isLeft"></Spin>
      <CreateUdfDialog :visible.sync="createUdfDialogVisible" @onSuccess="onUpdate"></CreateUdfDialog>
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
import CreateUdfDialog from './_source/CreateUdfDialog.vue'
import { getUdfFuncListPage } from '@/api/modules/resource'

export default {
  name: 'udf-function-index',
  components: {
    ListConstruction,
    Conditions,
    mList,
    Spin,
    NoData,
    CreateUdfDialog,
  },
  data() {
    return {
      total: null,
      isLoading: false,
      udfFuncList: [],
      searchParams: {
        id: -1,
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
      },
      isLeft: true,
      createUdfDialog: false,
      createUdfDialogVisible: false,
    }
  },
  watch: {
    searchParams: {
      deep: true,
      handler() {
        this._getList()
      },
    },
  },
  mounted() {
    this._getList()
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  methods: {
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
    _create() {
      this.createUdfDialogVisible = true
    },
    onUpdate() {
      this._updateList()
      this.createUdfDialog = false
    },

    close() {
      this.createUdfDialog = false
    },
    _updateList() {
      this._getList()
    },
    async _getList(flag) {
      sessionStorage.getItem('isLeft') === 0 ? (this.isLeft = false) : (this.isLeft = true)
      this.isLoading = !flag
      try {
        const res = await getUdfFuncListPage(this.searchParams)
        if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
          this.searchParams.pageNo = this.searchParams.pageNo - 1
        } else {
          this.udfFuncList = []
          this.udfFuncList = res.totalList
          this.total = res.total
        }
      } catch (e) {
        console.log(e)
      }
      this.isLoading = false
    },
  },
}
</script>
