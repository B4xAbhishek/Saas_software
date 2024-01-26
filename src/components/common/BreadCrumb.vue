<template>
  <v-breadcrumbs :items="items" class="pa-0 py-2">
    <template v-slot:item="{ item }"> 
      <router-link v-if="!item.disabled" class="underline-none" :to="item.to">{{ item.text }}</router-link>
      <span v-else>{{ item.text }}</span>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: null
    }
  }
}
</script>