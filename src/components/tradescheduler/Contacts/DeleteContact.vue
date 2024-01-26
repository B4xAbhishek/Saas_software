<template>
  <v-dialog v-if="dialog" v-model="dialog" persistent max-width="550">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2>Delete Contact</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <div v-if="contactInfo" class="mt-3 text-center">
          <h3 class="black--text mb-4">Are you sure you want to delete contact <span class="red--text pa-0">{{ contactInfo.name }}</span>?</h3>
  
          <div>
            <v-btn color="red" class="white--text" depressed>Delete</v-btn>
            <v-btn color="grey lighten-1" class="ml-1" depressed @click="close">Cancel</v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
    
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    contactInfo: {
      type: Object,
      default: null
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>