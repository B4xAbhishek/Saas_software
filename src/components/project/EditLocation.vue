<template>
  <v-dialog v-model="open" persistent max-width="450">
    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pb-1">
            <h2 class="black--text">Edit Location</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          
          <v-text-field
            v-model="info.name"
            label="Name"
            class="mt-2"
            :rules="[v => !!v || 'Name is Required']"
            dense
            outlined
          >
          </v-text-field>

          <v-textarea
            v-model="info.description"
            label="Description"
            class="mt-1"
            rows="3"
            outlined
          >
          </v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text :disabled="isLoading" @click="$emit('close')">Close</v-btn>
            <v-btn color="primary" type="submit" :loading="isLoading" text>Save</v-btn>
          </v-card-actions>
        </v-card-text></v-card>
    </v-form>
  </v-dialog>
</template>
  
<script>
export default {
  name: 'EditLocation',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      default: null
    },
    location: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isLoading: false,
      info: {
        id: this.project.id,
        name: null,
        description: null,
        location_id: this.location.id
      }
    }
  },
  created() {
    if (this.location) {
      this.info.name = this.location.name
      this.info.description = this.location.description
    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.isLoading = true

        const payload = { ...this.info }

        this.$store.dispatch('project/updateLocation', payload).then(() => {
          this.$emit('close')
        }).finally(() => {
          this.isLoading = false
        })
      }
    }
  }
}
</script>