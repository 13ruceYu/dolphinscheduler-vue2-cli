<template>
  <div class="home-main index-model">
    <div class="project-kinship-content">
      <div class="search-bar">
        <el-select
          filterable
          clearable
          :placeholder="$t('Process Name')"
          @change="onChange"
          :style="inputFocusStyle"
          v-tooltip="tooltipOption(currentItemName)"
          size="small"
        >
          <el-option
            v-for="work in workList"
            :key="work.id"
            :value="work.id"
            :label="work.name"
            v-tooltip="tooltipOption(work.name)"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="ri-record-circle-fill"
          size="mini"
          v-tooltip.small.top.start="$t('Reset')"
          @click="reset"
        ></el-button>
        <el-button
          icon="el-icon-view"
          size="mini"
          v-tooltip.small.top="$t('Dag label display control')"
          @click="changeLabel"
        ></el-button>
      </div>
      <GraphGrid v-if="!isLoading && !!locations.length" :isShowLabel="isShowLabel"></GraphGrid>
      <template v-if="!isLoading && !locations.length">
        <NoData style="height: 100%"></NoData>
      </template>
    </div>
    <Spin :is-spin="isLoading" :fullscreen="false"></Spin>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Spin from '@/components/spin/Spin'
import NoData from '@/components/noData/NoData'
import GraphGrid from './_source/GraphGrid.vue'

export default {
  name: 'ProjectsKinship',
  components: { GraphGrid, Spin, NoData },
  data() {
    return {
      isLoading: true,
      isShowLabel: true,
      currentItemName: '',
    }
  },
  computed: {
    ...mapState('kinship', ['locations', 'workList']),
    inputFocusStyle() {
      return 'width:280px'
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('kinship', ['getWorkFlowList', 'getWorkFlowDAG']),
    /**
     * init
     */
    init() {
      this.isLoading = true
      // Promise Get node needs data
      Promise.all([
        // get process definition
        this.getWorkFlowList(),
        this.getWorkFlowDAG(),
      ])
        .then((data) => {
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    /**
     * reset
     */
    reset() {
      this.isLoading = true
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
    async onChange(item) {
      this.isLoading = true
      this.currentItemName = item
      try {
        await this.getWorkFlowDAG(item)
      } catch (error) {
        this.$message.error(error.msg || '')
      }
      this.isLoading = false
    },
    tooltipOption(text) {
      return {
        text,
        maxWidth: '500px',
        placement: 'top',
        theme: 'dark',
        triggerEvent: 'mouseenter',
        large: false,
      }
    },
    changeLabel() {
      this.isLoading = true
      this.isShowLabel = !this.isShowLabel
      this.$nextTick(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
<style lang="scss" rel="stylesheet/scss">
.project-kinship-content {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  background: url('./_source/img/dag_bg.png');
  .search-bar {
    position: absolute;
    right: 8px;
    top: 10px;
    z-index: 2;
    .ans-input {
      transition: width 300ms ease-in-out;
    }
  }
}
</style>
