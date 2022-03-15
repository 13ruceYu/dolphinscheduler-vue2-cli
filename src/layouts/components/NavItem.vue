<template>
  <div class="clearfix list">
    <div class="nav-links">
      <router-link :to="{ path: path }" tag="a" active-class="active">
        <span><em :class="iconClass"></em>{{ $t(title) }}</span
        ><strong></strong>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    path: {
      type: String,
      default: '',
    },
    iconClass: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.list {
  width: 106px;
  float: left;
  position: relative;
  cursor: pointer;
  margin-right: 14px;
  .nav-links {
    height: 60px;
    a {
      position: relative;
      text-decoration: none;
      font-size: 15px;
      color: #333;
      display: inline-block;
      // float: left;
      text-align: center;
      span {
        display: block;
        width: 106px;
        color: #fff;
        .ansiconfont {
          vertical-align: -2px;
          font-size: 22px;
          margin-right: 4px;
        }
        .ansfont {
          vertical-align: -6px;
          font-size: 24px;
          margin-right: 4px;
        }
      }
      &:hover {
        span {
          color: #2d8cf0;
        }
      }
      &.active {
        span {
          color: #2d8bf0;
          i {
            color: #2d8cf0;
          }
        }
        b {
          height: 2px;
          background: #2d8cf0;
          display: block;
          margin-top: -2px;
        }
      }
    }
  }
}
</style>
