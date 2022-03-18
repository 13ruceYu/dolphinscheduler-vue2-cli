<template>
  <div class="process-state-count-model">
    <div v-show="!noData">
      <el-row class="data-area" v-spin="isSpin" style="height: 430px">
        <el-col :span="14">
          <div id="process-state-pie" style="width: 100%; height: 260px; margin-top: 100px"></div>
        </el-col>
        <el-col :span="10">
          <el-table :data="processStateList" size="mini">
            <el-table-column type="index" :label="$t('#')"></el-table-column>
            <el-table-column prop="value" :label="$t('Number')">
              <template slot-scope="{ row }">
                <span v-if="currentName === 'home'">{{ row.value }}</span>
                <a v-else href="javascript:" @click="searchParams.projectId && _goProcess(row.key)">{{ row.value }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="key" :label="$t('State')"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <NoData v-show="noData" :height="430"></NoData>
  </div>
</template>

<script>
import _ from 'lodash'
import { pie } from './chartConfig'
import Chart from '@/module/ana-charts'
import NoData from '@/components/noData/NoData'
import { stateType } from '@/view/projects/pages/_source/conditions/instance/common'
import { getProcessStateCount } from '@/api/modules/projects'

export default {
  name: 'ProcessStateCount',
  components: { NoData },
  props: {
    searchParams: Object,
  },
  data() {
    return {
      isSpin: true,
      noData: false,
      processStateList: [],
      currentName: '',
    }
  },
  watch: {
    searchParams: {
      deep: true,
      immediate: true,
      async handler(o) {
        this.isSpin = true
        const data = (await this.getProcessStateCount(o)) || []
        this.processStateList = _.map(data, (v) => {
          return {
            key: _.find(stateType, ['code', v.taskStateType]).label,
            value: v.count,
          }
        })
        this.isSpin = false
      },
    },
    processStateList(newVal) {
      if (!_.isEmpty(newVal)) {
        this.initChart(newVal)
      } else {
        this.noData = true
      }
    },
  },
  created() {
    this.currentName = this.$router.currentRoute.name
  },
  methods: {
    async getProcessStateCount() {
      try {
        const res = await getProcessStateCount()
        return res.taskCountDtos
      } catch (e) {
        console.log(e)
      }
    },
    _goProcess(name) {
      this.$router.push({
        name: 'projects-instance-list',
        query: {
          stateType: _.find(stateType, ['label', name]).code,
          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate,
        },
      })
    },
    initChart() {
      const myChart = Chart.pie('#process-state-pie', this.processStateList, {
        title: '',
      })
      myChart.echart.setOption(pie)
      // 首页不允许跳转
      if (this.searchParams.projectId) {
        myChart.echart.on('click', (e) => {
          this._goProcess(e.data.name)
        })
      }
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss"></style>
