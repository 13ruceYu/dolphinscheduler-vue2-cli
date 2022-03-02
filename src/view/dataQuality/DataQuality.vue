<template>
  <div class="main-layout-box">
    <SecondaryMenu :type="'dataQuality'"></SecondaryMenu>
    <router-view></router-view>
  </div>
</template>
<script>
import SecondaryMenu from '@/components/secondaryMenu/SecondaryMenu'
export default {
  name: 'DataQuality',
  components: { SecondaryMenu },
}
</script>
