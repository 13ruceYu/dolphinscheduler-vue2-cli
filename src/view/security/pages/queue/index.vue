/* * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the NOTICE
file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses this file
to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance with *
the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless required
by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific language
governing permissions and * limitations under the License. */
<template>
  <ListConstruction :title="$t('Queue manage')">
    <template slot="conditions">
      <Conditions @on-conditions="_onConditions">
        <template slot="button-group" v-if="isADMIN">
          <el-button size="mini" @click="_create('')">{{ $t('Create queue') }}</el-button>
          <el-dialog
            :title="item ? $t('Edit queue') : $t('Create queue')"
            :v-if="createQueueDialog"
            :visible.sync="createQueueDialog"
            width="auto"
          >
            <m-create-queue :item="item" @onUpdate="onUpdate" @close="close"></m-create-queue>
          </el-dialog>
        </template>
      </Conditions>
    </template>
    <template slot="content">
      <template v-if="queueList.length || total > 0">
        <m-list
          @on-edit="_onEdit"
          :queue-list="queueList"
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
      <template v-if="!queueList.length && total <= 0">
        <NoData></NoData>
      </template>
      <Spin :is-spin="isLoading" :is-left="isLeft"></Spin>
    </template>
  </ListConstruction>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import store from '@/store'
import Spin from '@/components/spin/Spin'
import mCreateQueue from './_source/createQueue'
import NoData from '@/components/noData/NoData'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import Conditions from '@/components/conditions/Conditions'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'queue-index',
  data() {
    return {
      total: null,
      isLoading: true,
      queueList: [],
      searchParams: {
        pageSize: 10,
        pageNo: 1,
        searchVal: '',
      },
      isLeft: true,
      isADMIN: store.state.user.userInfo.userType === 'ADMIN_USER',
      item: {},
      createQueueDialog: false,
    }
  },
  mixins: [listUrlParamHandle],
  props: {},
  methods: {
    ...mapActions('security', ['getQueueListP']),
    /**
     * Query
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
    _onEdit(item) {
      this._create(item)
    },
    _create(item) {
      this.item = item
      this.createQueueDialog = true
    },
    onUpdate() {
      this._debounceGET('false')
      this.createQueueDialog = false
    },

    close() {
      this.createQueueDialog = false
    },

    _getList(flag) {
      if (sessionStorage.getItem('isLeft') === 0) {
        this.isLeft = false
      } else {
        this.isLeft = true
      }
      this.isLoading = !flag
      this.getQueueListP(this.searchParams)
        .then((res) => {
          if (this.searchParams.pageNo > 1 && res.totalList.length === 0) {
            this.searchParams.pageNo = this.searchParams.pageNo - 1
          } else {
            this.queueList = []
            this.queueList = res.totalList
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
      // url no params get instance list
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  components: {
    mList,
    ListConstruction,
    Conditions,
    Spin,
    NoData,
    mCreateQueue,
  },
}
</script>
