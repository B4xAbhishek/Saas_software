<template>
  <v-dialog v-if="deleteModal" v-model="deleteModal" persistent max-width="450">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text">Delete Role</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <div class="mt-4 text-center">
          <span>Are you sure you want to Delete <strong class="primary--text">"{{ role.name }}"</strong>?</span>
        </div>

        <div class="mt-4 text-center">
          <v-btn class="primary" depressed :loading="deleteLoading" @click="deleteRole">Yes, Delete</v-btn>
          <v-btn class="grey lighten-2 ml-1" depressed :disabled="deleteLoading" @click="close">No, Cancel</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteRole',
  props: {
    deleteModal: {
      type: Boolean,
      required: true
    },
    role: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deleteLoading: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    deleteRole() {
      this.deleteLoading = true
      this.$store.dispatch('role/deleteRole', this.role.id).then((resp) => {
        this.emit('refresh')
      }).finally(() => {
        this.deleteLoading = false
      })
    }
  }
}
</script>