<template>
  <div class="list-model">
    <div class="table-box">
      <el-table :data="list" size="mini" style="width: 100%">
        <el-table-column type="index" :label="$t('#')" width="50"></el-table-column>
        <el-table-column :label="$t('Project Name')">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.name }}</p>
              <div slot="reference" class="name-wrapper">
                <a href="javascript:" class="links" @click="_switchProjects(scope.row)">{{ scope.row.name }}</a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="userName" :label="$t('Owned Users')"></el-table-column>
        <el-table-column prop="defCount" :label="$t('Process Define Count')"></el-table-column>
        <el-table-column prop="instRunningCount" :label="$t('Process Instance Running Count')"></el-table-column>
        <el-table-column :label="$t('Description')" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.description | filterNull }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Create Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Update Time')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Operation')" width="150">
          <template slot-scope="scope">
            <el-tooltip :content="$t('Edit')" placement="top" :enterable="false">
              <span
                ><el-button
                  class="opt-btn"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit-outline"
                  circle
                  @click="_edit(scope.row)"
                ></el-button
              ></span>
            </el-tooltip>
            <el-tooltip :content="$t('delete')" placement="top" :enterable="false">
              <el-popconfirm
                icon="el-icon-info"
                iconColor="red"
                :confirmButtonText="$t('Confirm')"
                :cancelButtonText="$t('Cancel')"
                :title="$t('Delete?')"
                @onConfirm="_delete(scope.row, scope.row.id)"
              >
                <el-button
                  class="opt-btn"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import localStore from '@/util/localStorage'
import { findComponentDownward } from '@/util/'

export default {
  name: 'List',
  props: {
    projectsList: Array,
    pageNo: Number,
    pageSize: Number,
  },
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.list = this.projectsList
  },
  watch: {
    projectsList(a) {
      this.list = []
      setTimeout(() => {
        this.list = a
      })
    },
  },
  methods: {
    ...mapActions('projects', ['deleteProjects']),
    ...mapMutations('dag', ['setProjectName']),
    _switchProjects(item) {
      this.setProjectName(item.name)
      localStore.setItem('projectName', `${item.name}`)
      localStore.setItem('projectId', `${item.id}`)
      this.$router.push({ path: `/projects/home` })
    },
    _delete(item) {
      this.deleteProjects({
        projectId: item.id,
      })
        .then((res) => {
          this.$emit('on-update')
          this.$message.success(res.msg)
        })
        .catch((e) => {
          this.$message.error(e.msg || '')
        })
    },
    _edit(item) {
      findComponentDownward(this.$root, 'ProjectsList')._create(item)
    },
  },
}
</script>

<style lang="scss" scoped>
.opt-btn {
  margin-right: 5px;
}
</style>
