<template>
  <div class="task-status-count-model">
    <div v-show="!msg">
      <el-row class="data-area" v-spin="isSpin" style="height: 430px">
        <el-col :span="14">
          <div id="task-status-pie" style="height: 260px; margin-top: 100px"></div>
        </el-col>
        <el-col :span="10">
          <div class="table-small-model">
            <table>
              <tr>
                <th width="40">{{ $t('#') }}</th>
                <th>{{ $t('Number') }}</th>
                <th>{{ $t('State') }}</th>
              </tr>
              <tr v-for="(item, $index) in taskStatusList" :key="$index">
                <td>
                  <span>{{ $index + 1 }}</span>
                </td>
                <td>
                  <span>
                    <a
                      href="javascript:"
                      @click="searchParams.projectId && _goTask(item.key)"
                      :class="searchParams.projectId ? 'links' : ''"
                      >{{ item.value }}</a
                    >
                  </span>
                </td>
                <td>
                  <span class="ellipsis" style="width: 98%" :title="item.key">{{ item.key }}</span>
                </td>
              </tr>
            </table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="msg">
      <NoData :msg="msg" v-if="msg" :height="430"></NoData>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { pie } from './chartConfig'
import Chart from '@/module/ana-charts'
import NoData from '@/components/noData/NoData'
import { stateType } from '@/view/projects/pages/_source/conditions/instance/common'

export default {
  name: 'TaskStatusCount',
  components: { NoData },
  props: {
    searchParams: Object,
  },
  data() {
    return {
      isSpin: true,
      msg: '',
      taskStatusList: [],
    }
  },
  watch: {
    searchParams: {
      deep: true,
      immediate: true,
      handler(o) {
        this.isSpin = true
        this.getTaskStatusCount(o)
          .then((res) => {
            this.taskStatusList = []
            this._handleTaskStatus(res)
            this.isSpin = false
          })
          .catch((e) => {
            console.log(e)
            this.msg = e.msg || 'error'
            this.isSpin = false
          })
      },
    },
  },
  methods: {
    ...mapActions('projects', ['getTaskStatusCount']),
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
    _handleTaskStatus(res) {
      let data = res.data.taskCountDtos
      this.taskStatusList = _.map(data, (v) => {
        return {
          // CHECK!!
          key: _.find(stateType, ['code', v.taskStateType]).label,
          value: v.count,
          type: 'type',
        }
      })
      const myChart = Chart.pie('#task-status-pie', this.taskStatusList, {
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
