<template>
  <v-dialog v-if="createModal" v-model="createModal" persistent max-width="650">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text">Create Role</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <v-form ref="form" lazy-validation @submit.prevent="createRole">
          <v-text-field
            v-model="newRole.name"
            label="Enter Role Name"
            :rules="[(v) => !!v || 'Role Name is Required']"
            class="mt-3"
            dense
            outlined
          ></v-text-field>

          <v-row no-gutters align="center">
            <v-col cols="6">
              <strong>Permission</strong>
            </v-col>
            <v-col cols="3">
              <strong>Read</strong>
            </v-col>
            <v-col cols="3">
              <strong>Write</strong>
            </v-col>
          </v-row>

          <v-row v-for="(role, index) in roles" :key="index" no-gutters align="center">
            <v-col cols="6">
              <span class="pl-0">{{ role.name }}</span>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="role.read"></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="role.write"></v-checkbox>
            </v-col>
          </v-row>

          <div class="text-right">
            <v-btn type="submit" color="primary" :loading="loading" depressed>Create Role</v-btn>
          </div>
        </v-form>
        
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateRole',
  props: {
    createModal: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      roles: [],
      newRole: {
        name: null,
        access: []
      }
    }
  },

  created() {
    this.loadRoleModules()
  },

  methods: {
    close() {
      this.$emit('close')
    },
    loadRoleModules() {
      this.$store.dispatch('role/getRoleModules').then((resp) => {
        console.log(resp)
        this.roles = [...resp].map((item) => {
          return {
            name: item.name,
            read: true,
            write: true
          }
        })
      })
    },

    createRole() {
      if (this.$refs.form.validate()) {
        const access = []

        this.roles.forEach((item) => {
          if (item.read) {
            const name = item.name.toLowerCase() + '__read'

            access.push(name)
          }
          if (item.write) {
            const name = item.name.toLowerCase() + '__write'

            access.push(name)
          }
        })

        const payload = {
          name: this.newRole.name,
          access_list: [...access]
        }

        this.loading = true
        this.$store.dispatch('role/createRole', payload).then(() => {
          this.$emit('refresh')
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>