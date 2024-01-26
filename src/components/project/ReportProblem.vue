<template>
  <v-dialog v-model="open" persistent max-width="450">
    <v-form ref="form" lazy-validation @submit.prevent="report">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between">
            <h2 class="black--text">Report a Problem</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-select
            v-model="problem.title"
            class="mt-3"
            :items="problem_types"
            outlined
            dense
            label="Problem Type"
            :rules="[v => !!v || 'Problem type is required.']"
          ></v-select>

          <v-textarea v-model="problem.description" outlined :rules="[v => !!v || 'Description is required.']" label="Description"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text :disabled="isLoading" @click="$emit('close')">Close</v-btn>
          <v-btn color="primary" type="submit" :loading="isLoading" text>Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'ReportProblem',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    sn: {
      type: String,
      default: null
    },
    cameraId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLoading: false,
      problem: {
        title: null,
        description: null,
        fromCustomer: true
      },
      problem_types: []
    }
  },
  created() {
    this.getProblemTypes()
  },
  methods: {
    getProblemTypes() {
      this.$store.dispatch('support/getProblemTypes').then((resp) => {
        this.problem_types = [...resp.data]
      })
    },
    report() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$store.dispatch('support/createTicket', { ...this.problem, sn: this.sn, camera_id: this.cameraId }).then(() => {
          this.$emit('close')
        }).finally(() => {
          this.isLoading = false
        })
      }
    }
  }
}
</script>
