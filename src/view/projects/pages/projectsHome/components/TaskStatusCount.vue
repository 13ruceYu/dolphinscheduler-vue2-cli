<template>
  <div class="task-status-count-model">
    <div v-show="!noData">
      <el-row class="data-area" v-spin="isSpin" style="height: 430px">
        <el-col :span="14">
          <div id="task-status-pie" style="height: 260px; margin-top: 100px"></div>
        </el-col>
        <el-col :span="10">
          <el-table :data="taskStatusList" size="mini">
            <el-table-column type="index" :label="$t('#')"></el-table-column>
            <el-table-column prop="value" :label="$t('Number')">
              <template slot-scope="{ row }">
                <span v-if="currentName === 'home'">{{ row.value }}</span>
                <a v-else href="javascript:" @click="searchParams.projectId && _goTask(row.key)">{{ row.value }}</a>
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
import { getTaskStatusCount } from '@/api/modules/projects'

export default {
  name: 'TaskStatusCount',
  components: { NoData },
  props: {
    searchParams: Object,
  },
  data() {
    return {
      isSpin: true,
      taskStatusList: [],
      currentName: '',
      noData: false,
    }
  },
  watch: {
    searchParams: {
      deep: true,
      immediate: true,
      async handler(o) {
        this.isSpin = true
        const res = await this.getTaskStatusCount(o)
        this.taskStatusList = _.map(res, (v) => {
          return {
            // CHECK!!
            key: _.find(stateType, ['code', v.taskStateType]).label,
            value: v.count,
            type: 'type',
          }
        })
        this.isSpin = false
      },
    },
    taskStatusList(newVal) {
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
    async getTaskStatusCount(params) {
      try {
        const res = await getTaskStatusCount(params)
        return res.taskCountDtos
      } catch (e) {
        console.log(e)
      }
    },
    _goTask(name) {
      this.$router.push({
        name: 'task-instance',
        query: {
          stateType: _.find(stateType, ['label', name]).code,
          startDate: this.searchParams.startDate,
          endDate: this.searchParams.endDate,
        },
      })
    },
    initChart(data) {
      const myChart = Chart.pie('#task-status-pie', data, {
        title: '',
      })
      myChart.echart.setOption(pie)
      // Jump forbidden in index page
      if (this.searchParams.projectId) {
        myChart.echart.on('click', (e) => {
          this._goTask(e.data.name)
        })
      }
    },
  },
}
</script>
