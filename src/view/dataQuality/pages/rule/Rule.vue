<template>
  <div class="wrap-result">
    <ListConstruction :title="$t('DataQuality Rule')">
      <template slot="conditions">
        <m-rule-conditions @on-query="_onQuery"></m-rule-conditions>
      </template>
      <template slot="content">
        <template v-if="ruleList.length || total > 0">
          <m-list
            @on-edit="_onEdit"
            :rule-list="ruleList"
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
        <template v-if="!ruleList.length && total <= 0">
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
import ListConstruction from '@/components/listConstruction/ListConstruction'
import mRuleConditions from '@/view/dataQuality/_source/conditions/rule'

export default {
  name: 'Rule',
  components: { mList, ListConstruction, Spin, NoData, mRuleConditions },
  data() {
    return {
      total: null,
      isLoading: true,
      ruleList: [],
      searchParams: {
        pageSize: 10,
        pageNo: 1,
        // start date
        startDate: '',
        // end date
        endDate: '',
        // search value
        searchVal: '',
      },
      isLeft: true,
      item: {},
    }
  },
  mixins: [listUrlParamHandle],
  methods: {
    ...mapActions('dataQuality', ['getDataQualityRuleListPage']),
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
      this.getDataQualityRuleListPage(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.ruleList = []
            this.ruleList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch((e) => {
          this.isLoading = false
        })
    },
  },
  watch: {
    // router
    $route(a) {
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
    },
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
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
