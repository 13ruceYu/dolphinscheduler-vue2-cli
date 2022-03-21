<template>
  <div class="wrap-definition">
    <ListConstruction :title="$t('Process definition')">
      <template slot="conditions">
        <Conditions @on-conditions="_onConditions">
          <template slot="button-group">
            <el-button size="mini" @click="() => this.$router.push({ name: 'definition-create' })">{{
              $t('Create process')
            }}</el-button>
            <el-button size="mini" @click="_uploading">{{ $t('Import process') }}</el-button>
          </template>
        </Conditions>
      </template>
      <template slot="content">
        <template v-if="processListP.length || total > 0">
          <m-list
            :process-list="processListP"
            @on-update="_onUpdate"
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
        <NoData v-else></NoData>
        <Spin :is-spin="isLoading" :is-left="isLeft"></Spin>
        <WorkflowUploadDialog
          :visible.sync="workflowUploadDialogVisible"
          @uploadFileSuccess="_getList"
        ></WorkflowUploadDialog>
      </template>
    </ListConstruction>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import Spin from '@/components/spin/Spin'
import localStore from '@/util/localStorage'
import NoData from '@/components/noData/NoData'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'
import WorkflowUploadDialog from './WorkflowUploadDialog.vue'

export default {
  name: 'DefinitionList',
  components: { mList, Conditions, Spin, ListConstruction, NoData, WorkflowUploadDialog },
  mixins: [listUrlParamHandle],
  data() {
    return {
      total: null,
      processListP: [],
      isLoading: true,
      searchParams: {
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
        userId: '',
      },
      isLeft: true,
      workflowUploadDialogVisible: false,
    }
  },
  watch: {
    $route(a) {
      // url no params get instance list
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
    },
  },
  created() {
    localStore.removeItem('subProcessId')
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  methods: {
    ...mapActions('dag', ['getProcessListP']),
    // File Upload
    _uploading() {
      this.workflowUploadDialogVisible = true
    },
    // page
    _page(val) {
      this.searchParams.pageNo = val
    },
    _pageSize(val) {
      this.searchParams.pageSize = val
    },
    // conditions
    _onConditions(o) {
      this.searchParams.searchVal = o.searchVal
      this.searchParams.pageNo = 1
    },
    // get data list
    _getList(flag) {
      if (sessionStorage.getItem('isLeft') === 0) {
        this.isLeft = false
      } else {
        this.isLeft = true
      }
      this.isLoading = !flag
      this.getProcessListP(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.processListP = []
            this.processListP = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    _onUpdate() {
      this._debounceGET('false')
    },
    _updateList() {
      this.searchParams.pageNo = 1
      this.searchParams.searchVal = ''
      this._debounceGET()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap-definition {
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
          width: 300px;
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
          padding-right: 330px;
        }
      }
    }
  }
}
</style>
