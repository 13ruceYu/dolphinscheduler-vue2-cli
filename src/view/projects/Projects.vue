<template>
  <div class="main-layout-box" :class="!isProjectsList ? '' : 'no'">
    <SecondaryMenu :type="'projects'" v-if="!isProjectsList"></SecondaryMenu>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import SecondaryMenu from '@/components/secondaryMenu/SecondaryMenu'
export default {
  name: 'Projects',
  components: { SecondaryMenu },
  data() {
    return {
      isProjectsList: this.$router.history.current.name === 'projects-list',
    }
  },
  watch: {
    $route({ name }) {
      this.isProjectsList = name === 'projects-list'
    },
  },
}
</script>
