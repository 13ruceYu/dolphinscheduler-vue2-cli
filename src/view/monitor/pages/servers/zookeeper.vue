/* * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the NOTICE
file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses this file
to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance with *
the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless required
by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific language
governing permissions and * limitations under the License. */
<template>
  <ListConstruction :title="'Zookeeper ' + $t('Manage')">
    <template slot="content">
      <template v-if="zookeeperList.length">
        <m-list :list="zookeeperList"></m-list>
      </template>
      <template v-if="!zookeeperList.length">
        <NoData></NoData>
      </template>
      <Spin :is-spin="isLoading"></Spin>
    </template>
  </ListConstruction>
</template>
<script>
import { mapActions } from 'vuex'
import mList from './_source/zookeeperList'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'servers-zookeeper',
  data() {
    return {
      isLoading: false,
      zookeeperList: [],
    }
  },
  props: {},
  methods: {
    ...mapActions('monitor', ['getZookeeperData']),
  },
  watch: {},
  created() {
    this.isLoading = true
    this.getZookeeperData()
      .then((res) => {
        this.zookeeperList = res
        this.isLoading = false
      })
      .catch(() => {
        this.isLoading = false
      })
  },
  mounted() {},
  components: { mList, ListConstruction, Spin, NoData },
}
</script>
<style lang="scss" rel="stylesheet/scss">
@import './servers';
</style>
