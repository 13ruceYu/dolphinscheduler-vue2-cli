<template>
  <div class="define-user-count-model">
    <div v-if="msg">
      <div class="data-area" v-spin="isSpin">
        <div id="process-definition-bar" style="height: 500px"></div>
      </div>
    </div>
    <NoData v-else :height="530"></NoData>
  </div>
</template>
<script>
import _ from 'lodash'
import { bar } from './chartConfig'
import Chart from '@/module/ana-charts'
import NoData from '@/components/noData/NoData'
import { getDefineUserCount } from '@/api/modules/projects'

export default {
  name: 'DefineUserCount',
  components: { NoData },
  props: {
    projectId: Number,
  },
  data() {
    return {
      isSpin: true,
      msg: true,
      parameter: { projectId: 0 },
      defineUserList: [],
    }
  },
  watch: {
    defineUserList(newVal) {
      if (!_.isEmpty(newVal)) {
        this.initChart(newVal)
      } else {
        this.noData = true
      }
    },
  },
  async mounted() {
    this.isSpin = true
    this.parameter.projectId = this.projectId
    const data = (await this.getDefineUserCount()) || []
    this.defineUserList = _.map(data, (v) => {
      return {
        key: v.userName + ',' + v.userId + ',' + v.count,
        value: v.count,
      }
    })
    this.isSpin = false
  },
  methods: {
    async getDefineUserCount() {
      try {
        const res = await getDefineUserCount(this.parameter)
        return res.userList
      } catch (e) {
        console.log(e)
      }
    },
    initChart() {
      const myChart = Chart.bar('#process-definition-bar', this.defineUserList, {})
      myChart.echart.setOption(bar)
      // Jump not allowed on home page
      if (this.projectId) {
        myChart.echart.on('click', (e) => {
          this.$router.push({
            name: 'projects-definition-list',
            query: {
              userId: e.name.split(',')[1],
            },
          })
        })
      }
    },
  },
}
</script>
