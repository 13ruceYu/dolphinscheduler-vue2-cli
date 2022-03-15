/* * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the NOTICE
file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses this file
to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance with *
the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless required
by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific language
governing permissions and * limitations under the License. */
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
      <template v-if="!udfResourcesList.length && total <= 0">
        <NoData></NoData>
      </template>
      <Spin :is-spin="isLoading" :is-left="isLeft"> </Spin>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import mList from './_source/list'
import localStore from '@/util/localStorage'
import Spin from '@/components/spin/Spin'
import { findComponentDownward } from '@/util/'
import NoData from '@/components/noData/NoData'
import listUrlParamHandle from '@/module/mixin/listUrlParamHandle'
import Conditions from '@/components/conditions/Conditions'

export default {
  name: 'resource-list-index-UDF',
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
    }
  },
  mixins: [listUrlParamHandle],
  props: {},
  methods: {
    ...mapActions('resource', ['getResourcesListP', 'getResourceId']),
    /**
     * File Upload
     */
    _uploading() {
      findComponentDownward(this.$root, 'Nav')._resourceChildUpdate('UDF', this.searchParams.id)
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
      this._debounceGET()
    },
    _updateList(data) {
      this.searchParams.id = data
      this.searchParams.pageNo = 1
      this.searchParams.searchVal = ''
      this._debounceGET()
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
            this.udfResourcesList = []
            this.udfResourcesList = res.totalList
            this.total = res.total
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
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
    transferApi(api) {
      this.getResourceId({
        type: 'UDF',
        fullName: api,
      })
        .then((res) => {
          localStore.setItem('currentDir', `${res.fullName}`)
          this.$router.push({ path: `/resource/udf/subUdfDirectory/${res.id}` })
        })
        .catch((e) => {
          this.$message.error(e.msg || '')
        })
    },
  },
  watch: {
    // router
    $route(a) {
      // url no params get instance list
      this.searchParams.pageNo = _.isEmpty(a.query) ? 1 : a.query.pageNo
      this.searchParams.id = a.params.id
      let dir = localStore.getItem('currentDir').split('/')
      dir.shift()
      this.breadList = dir
    },
  },
  created() {},
  mounted() {
    let dir = localStore.getItem('currentDir').split('/')
    dir.shift()
    this.breadList = dir
  },
  beforeDestroy() {
    sessionStorage.setItem('isLeft', 1)
  },
  components: { Conditions, mList, Spin, NoData },
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
