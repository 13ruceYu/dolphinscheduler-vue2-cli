<template>
  <div class="main-layout-box">
    <SecondaryMenu :type="'monitor'"></SecondaryMenu>
    <router-view></router-view>
  </div>
</template>
<script>
import SecondaryMenu from '@/components/secondaryMenu/SecondaryMenu'
export default {
  name: 'Monitor',
  components: { SecondaryMenu },
}
</script>
