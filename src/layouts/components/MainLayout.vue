<template>
  <div class="main-layout-model">
    <div class="m-top">
      <slot name="top"></slot>
    </div>
    <div class="m-bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainLayout',
}
</script>

<style lang="scss" rel="stylesheet/scss">
.main-layout-model {
  position: relative;
  .m-top {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    height: 60px;
    z-index: 1000;
  }
  .m-bottom {
    position: absolute;
    top: 60px;
    left: 0px;
    width: 100%;
    min-height: calc(100% - 60px);
  }
  &.dag-screen {
    .m-top {
      position: unset;
    }
    .m-bottom {
      z-index: 2;
    }
    .index-model {
      width: 100%;
      height: 100%;
      position: fixed;
      top: -20px;
      left: -20px;
      .dag-model {
        height: 100% !important;
      }
    }
  }
}
</style>
