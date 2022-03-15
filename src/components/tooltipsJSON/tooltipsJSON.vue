<template>
  <div class="tooltips-model">
    <el-popover placement="top-start" trigger="click">
      <pre :id="'result-' + id" class="result"></pre>
      <em class="iconfont" slot="reference">
        <slot name="reference"></slot>
      </em>
    </el-popover>
  </div>
</template>
<script>
import $ from 'jquery'
import { syntaxHighlight } from '@/util/util'

export default {
  name: 'tooltips',
  data() {
    return {}
  },
  props: {
    JSON: String,
    id: Number,
  },
  mounted() {
    $(`#result-${this.id}`).html(syntaxHighlight(this.JSON))
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
.el-popover {
  .result {
    border: 0;
    padding: 5px;
    background: #fff;
    font-size: 12px;
  }
  .string {
    color: green;
  }
  .number {
    color: darkorange;
  }
  .boolean {
    color: blue;
  }
  .null {
    color: magenta;
  }
  .key {
    color: red;
  }
}
</style>
