<template>
  <MainLayout>
    <Nav slot="top"></Nav>
    <router-view slot="bottom" v-if="isRenderRouterView"></router-view>
  </MainLayout>
</template>

<script>
import visibility from '@/module/visibility'
import MainLayout from './components/MainLayout.vue'
import Nav from './components/Nav.vue'
export default {
  name: 'BasicLayout',
  components: { MainLayout, Nav },
  data() {
    return {
      isRenderRouterView: true,
    }
  },
  methods: {
    reload() {
      this.isRenderRouterView = false
      this.$nextTick(() => {
        this.isRenderRouterView = true
      })
    },
  },
  mounted() {
    visibility.change((evt, hidden) => {
      if (hidden === false && this.$route.meta.refresh_in_switched_tab) {
        this.reload()
      }
    })
  },
}
</script>
