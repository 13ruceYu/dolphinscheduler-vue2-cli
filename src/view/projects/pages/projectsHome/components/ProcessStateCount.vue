<template>
  <div class="process-state-count-model">
    <div v-show="!msg">
      <el-row class="data-area" v-spin="isSpin" style="height: 430px">
        <el-col :span="14">
          <div id="process-state-pie" style="width: 100%; height: 260px; margin-top: 100px"></div>
        </el-col>
        <el-col :span="10">
          <div class="table-small-model">
            <table>
              <tr>
                <th width="40">{{ $t('#') }}</th>
                <th>{{ $t('Number') }}</th>
                <th>{{ $t('State') }}</th>
              </tr>
              <tr v-for="(item, $index) in processStateList" :key="$index">
                <td>
                  <span>{{ $index + 1 }}</span>
                </td>
                <td>
                  <a v-if="currentName === 'home'" style="cursor: default">{{ item.value }}</a>
                  <span v-else
                    ><a href="javascript:" @click="searchParams.projectId && _goProcess(item.key)">{{
                      item.value
                    }}</a></span
                  >
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
import echarts from 'echarts'
import NoData from '@/components/noData/NoData'
import { stateType } from '@/view/projects/pages/_source/conditions/instance/common'
export default {
  name: 'ProcessStateCount',
  components: { NoData },
  props: {
    searchParams: Object,
  },
  data() {
    return {
      isSpin: true,
      msg: '',
      processStateList: [],
      currentName: '',
    }
  },
  created() {
    this.currentName = this.$router.currentRoute.name
  },
  methods: {
    ...mapActions('projects', ['getProcessStateCount']),
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
    _handleProcessState(res) {
      let data = res.data.taskCountDtos
      this.processStateList = _.map(data, (v) => {
        return {
          key: _.find(stateType, ['code', v.taskStateType]).label,
          value: v.count,
        }
      })
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
  watch: {
    searchParams: {
      deep: true,
      immediate: true,
      handler(o) {
        this.isSpin = true
        this.getProcessStateCount(o)
          .then((res) => {
            this.processStateList = []
            this._handleProcessState(res)
            this.isSpin = false
          })
          .catch((e) => {
            this.msg = e.msg || 'error'
            this.isSpin = false
          })
      },
    },
    '$store.state.projects.sideBar': function () {
      echarts.init(document.getElementById('process-state-pie')).resize()
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss"></style>
