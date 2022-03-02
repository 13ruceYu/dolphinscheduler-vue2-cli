<template>
  <div ref="graph-grid" class="graph-grid"></div>
</template>
<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import graphGridOption from './graphGridOption'

export default {
  name: 'GraphGrid',
  props: {
    id: String,
    locations: Array,
    connects: Array,
    isShowLabel: Boolean,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('kinship', ['locations', 'connects', 'sourceWorkFlowId']),
  },
  mounted() {
    const graphGrid = echarts.init(this.$refs['graph-grid'])
    graphGrid.setOption(graphGridOption(this.locations, this.connects, this.sourceWorkFlowId, this.isShowLabel), true)
    graphGrid.on('click', (params) => {
      // Jump to the definition page
      this.$router.push({ path: `/projects/definition/list/${params.data.id}` })
    })
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.graph-grid {
  width: 100%;
  height: calc(100vh - 100px);
  background: url('./img/dag_bg.png');
}
</style>
