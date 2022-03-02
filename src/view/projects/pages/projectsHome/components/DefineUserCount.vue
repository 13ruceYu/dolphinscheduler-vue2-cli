<template>
  <div class="define-user-count-model">
    <div v-if="msg">
      <div class="data-area" v-spin="isSpin">
        <div id="process-definition-bar" style="height: 500px"></div>
      </div>
    </div>
    <div v-else>
      <NoData :height="530"></NoData>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { bar } from './chartConfig'
import Chart from '@/module/ana-charts'
import NoData from '@/components/noData/NoData'
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
    }
  },
  created() {
    this.isSpin = true
    this.parameter.projectId = this.projectId
    this.getDefineUserCount(this.parameter)
      .then((res) => {
        this.msg = res.data.count > 0
        this.defineUserList = []
        this._handleDefineUser(res)
        this.isSpin = false
      })
      .catch((e) => {
        this.isSpin = false
      })
  },
  methods: {
    ...mapActions('projects', ['getDefineUserCount']),
    _handleDefineUser(res) {
      let data = res.data.userList || []
      this.defineUserList = _.map(data, (v) => {
        return {
          key: v.userName + ',' + v.userId + ',' + v.count,
          value: v.count,
        }
      })
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
