<template>
  <div class="conditions-model">
    <div class="left">
      <slot name="button-group"></slot>
    </div>
    <div class="right">
      <div class="from-box">
        <slot name="search-group" v-if="isShow"></slot>
        <template v-if="!isShow">
          <div class="list">
            <el-button size="mini" @click="_ckQuery" icon="el-icon-search"></el-button>
          </div>
          <div class="list">
            <el-input
              v-model="searchVal"
              @keyup.enter="_ckQuery"
              size="mini"
              :placeholder="$t('Please enter keyword')"
              type="text"
              style="width: 180px"
            >
            </el-input>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'Conditions',
  props: {
    operation: Array,
  },
  data() {
    return {
      // search value
      searchVal: '',
    }
  },
  methods: {
    /**
     * emit Query parameter
     */
    _ckQuery() {
      this.$emit('on-conditions', {
        searchVal: _.trim(this.searchVal),
      })
    },
  },
  computed: {
    // Whether the slot comes in
    isShow() {
      return this.$slots['search-group']
    },
  },
  created() {
    // Routing parameter merging
    if (!_.isEmpty(this.$route.query)) {
      this.searchVal = this.$route.query.searchVal || ''
    }
  },
}
</script>
