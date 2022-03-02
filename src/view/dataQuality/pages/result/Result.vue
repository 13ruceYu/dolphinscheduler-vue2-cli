<template>
  <div class="wrap-result">
    <ListConstruction :title="$t('DataQuality Result')">
      <template slot="conditions">
        <m-result-conditions @on-query="_onQuery"></m-result-conditions>
      </template>

      <template slot="content">
        <template v-if="resultList.length || total > 0">
          <m-list
            @on-edit="_onEdit"
            :result-list="resultList"
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
        <template v-if="!resultList.length && total <= 0">
          <NoData></NoData>
        </template>
        <Spin :is-spin="isLoading" :is-left="isLeft"></Spin>
      </template>
    </ListConstruction>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import mResultConditions from '@/view/dataQuality/_source/conditions/result'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'Result',
  components: { mList, ListConstruction, mResultConditions, Spin, NoData },
  mixins: [listUrlParamHandle],
  data() {
    return {
      total: null,
      isLoading: true,
      resultList: [],
      searchParams: {
        pageSize: 10,
        pageNo: 1,
        // state
        state: '',
        // start date
        startDate: '',
        // end date
        endDate: '',
        // search value
        searchVal: '',

        ruleType: '',
      },
      isLeft: true,
      item: {},
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
    ...mapActions('dataQuality', ['getResultListPage']),
    /**
     * click query
     */
    _onQuery(o) {
      this.searchParams = _.assign(this.searchParams, o)
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
      this.getResultListPage(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.resultList = []
            this.resultList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch((e) => {
          this.isLoading = false
        })
    },
  },
}
</script>
<style lang="scss" rel="stylesheet/scss">
.wrap-result {
  .table-box {
    overflow-y: scroll;
  }
  .table-box {
    .fixed {
      table-layout: auto;
      tr {
        th:last-child,
        td:last-child {
          background: inherit;
          width: 60px;
          height: 40px;
          line-height: 40px;
          border-left: 1px solid #ecf3ff;
          position: absolute;
          right: 0;
          z-index: 2;
        }
        td:last-child {
          border-bottom: 1px solid #ecf3ff;
        }
        th:nth-last-child(2) {
          padding-right: 90px;
        }
      }
    }
  }
  .list-model {
    .el-dialog__header,
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
