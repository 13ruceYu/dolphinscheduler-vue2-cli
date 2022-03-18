<template>
  <ListConstruction :title="$t('Project')">
    <template slot="conditions">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group">
          <el-button size="mini" @click="_create('')">{{ $t('Create Project') }}</el-button>
          <el-dialog
            :title="item ? $t('Edit') : $t('Create Project')"
            v-if="createProjectDialog"
            :visible.sync="createProjectDialog"
            width="auto"
          >
            <CreateProject :item="item" @_onUpdate="_onUpdate" @close="_close"></CreateProject>
          </el-dialog>
        </template>
      </Conditions>
    </template>
    <template slot="content">
      <template v-if="projectsList.length || total > 0">
        <List
          :projects-list="projectsList"
          @on-update="_onUpdate"
          :page-no="searchParams.pageNo"
          :page-size="searchParams.pageSize"
        ></List>
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
      <Spin :is-spin="isLoading" :is-left="false"></Spin>
    </template>
  </ListConstruction>
</template>
<script>
import { mapActions } from 'vuex'
import _ from 'lodash'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import List from './components/List'
import CreateProject from './components/CreateProject'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'ProjectsList',
  components: {
    ListConstruction,
    Spin,
    Conditions,
    List,
    CreateProject,
    NoData,
  },
  mixins: [listUrlParamHandle],
  data() {
    return {
      total: null,
      projectsList: [],
      isLoading: true,
      searchParams: {
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
      },
      createProjectDialog: false,
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
  methods: {
    ...mapActions('projects', ['getProjectsList']),
    /**
     * Inquire
     */
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
    _create(item) {
      this.createProjectDialog = true
      this.item = item
    },
    _onUpdate() {
      this.createProjectDialog = false
      this._debounceGET()
    },
    _close() {
      this.createProjectDialog = false
    },
    _getList(flag) {
      this.isLoading = !flag
      this.getProjectsList(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.projectsList = []
            this.projectsList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
  },
}
</script>
