<template>
  <ListConstruction :title="searchParams.projectId ? $t('Project Home') : $t('Home')">
    <template slot="content">
      <div class="perject-home-content">
        <div class="time-model">
          <el-date-picker
            v-model="dataTime"
            type="datetimerange"
            size="small"
            @change="_datepicker"
            range-separator="-"
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="chart-title">
              <span>{{ $t('Task status statistics') }}</span>
            </div>
            <div class="row">
              <TaskStatusCount :search-params="searchParams"> </TaskStatusCount>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="chart-title">
              <span>{{ $t('Process Status Statistics') }}</span>
            </div>
            <div class="row">
              <ProcessStateCount :search-params="searchParams"> </ProcessStateCount>
            </div>
          </el-col>
        </el-row>
        <div>
          <div class="chart-title" style="margin-bottom: -20px; margin-top: 30px">
            <span>{{ $t('Process Definition Statistics') }}</span>
          </div>
          <div>
            <DefineUserCount :project-id="searchParams.projectId"> </DefineUserCount>
          </div>
        </div>
      </div>
    </template>
  </ListConstruction>
</template>
<script>
import dayjs from 'dayjs'
import DefineUserCount from './components/DefineUserCount'
import TaskStatusCount from './components/TaskStatusCount'
import ProcessStateCount from './components/ProcessStateCount'
import localStore from '@/util/localStorage'
import ListConstruction from '@/components/listConstruction/ListConstruction'

export default {
  name: 'ProjectsHome',
  components: {
    ListConstruction,
    DefineUserCount,
    TaskStatusCount,
    ProcessStateCount,
  },
  props: {
    id: Number,
  },
  data() {
    return {
      searchParams: {
        projectId: null,
        startDate: '',
        endDate: '',
      },
      dataTime: [],
    }
  },
  created() {
    this.searchParams.projectId = this.id === 0 ? 0 : localStore.getItem('projectId')
    this.dataTime[0] = dayjs().format('YYYY-MM-DD 00:00:00')
    this.dataTime[1] = dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  methods: {
    _datepicker(val) {
      this.searchParams.startDate = val[0]
      this.searchParams.endDate = val[1]
    },
  },
}
</script>

<style lang="scss" scoped>
.perject-home-content {
  padding: 10px 20px;
  position: relative;
  .time-model {
    position: absolute;
    right: 8px;
    top: -40px;
    .ans-input {
      > input {
        width: 344px;
      }
    }
  }
  .chart-title {
    text-align: center;
    height: 60px;
    line-height: 60px;
    span {
      font-size: 22px;
      color: #333;
      font-weight: bold;
    }
  }
}
.table-small-model {
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
}
</style>
