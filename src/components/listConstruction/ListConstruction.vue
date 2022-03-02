<template>
  <div class="home-main list-construction-model">
    <div class="content-title">
      <span>{{ title }}</span>
      <slot name="operation"></slot>
    </div>
    <div class="conditions-box">
      <slot name="conditions"> </slot>
    </div>
    <div class="list-box">
      <slot name="content"> </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ListConstruction',
  props: {
    title: String,
  },
}
</script>
