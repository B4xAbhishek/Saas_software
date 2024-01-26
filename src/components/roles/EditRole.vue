<template>
  <v-dialog v-if="editModal" v-model="editModal" persistent max-width="650">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text">Edit Role</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <template v-if="loading">
          <div class="text-center mt-4">
            <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
            <h4>Loading Role...</h4>
          </div>
        </template>
        <template v-if="!loading && role">
          <v-form ref="form" lazy-validation @submit.prevent="updateRole">
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
  
            <v-row v-for="(role, index) in newRole.access" :key="index" no-gutters align="center">
              <v-col cols="6">
                <span class="pl-0 text-capitalize">{{ role.name }}</span>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="role.read" :disabled="role.write"></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="role.write"></v-checkbox>
              </v-col>
            </v-row>
  
            <div class="text-right">
              <v-btn type="submit" color="primary" :loading="editLoading" depressed>Edit Role</v-btn>
            </div>
          </v-form>
        </template>
          
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
<script>
export default {
  name: 'EditRole',
  props: {
    editModal: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      loading: false,
      editLoading: false,
      roles: [],
      role: null,
      newRole: {
        name: null,
        access: []
      }
    }
  },
  watch:{
    newRole:{
      handler(newVal ) {
        console.log('New value:', newVal.access[0].name)
        for (const i in newVal.access) {
          if (newVal.access[i].write) {
            newVal.access[i].read = true
            this.changesDetected = true
          }
        }
      },
      deep:true,
      immediate:true
    }
  },
  
  created() {
    this.loadRole()
  },
  
  methods: {
    close() {
      this.$emit('close')
    },
    async loadRole() {
      this.loading = true
      this.$store.dispatch('role/getRole', this.item.id).then(async (resp) => {
        this.role = { ...resp }
        await this.loadRoleModules()
        this.setRole(this.role)
        this.verifyRoles()
      }).finally(() => {
        this.loading = false
      })
    },
    async loadRoleModules() {
      this.loading = true
      await this.$store.dispatch('role/getRoleModules').then((resp) => {
        this.roles = [...resp].map((item) => {
          return {
            name: item.name,
            read: false,
            write: false
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },

    verifyRoles() {
      this.roles.forEach((item, index) => {
        const roleIndex = this.newRole.access.findIndex((role) => role.name.toLowerCase() === item.name.toLowerCase())

        if (roleIndex < 0) {
          this.newRole.access.unshift(this.roles[index])
        }
      })
    },

    setRole(item) {
      const accessList = []
      const modules = item.access_list.map((access) => access.split('__')[0])
      const uniqueModules = [...new Set(modules)].map((access) => {
        return {
          name: access.split('__')[0],
          read: false,
          write: false
        }
      })

      uniqueModules.forEach((uM) => {
        const read = uM.name + '__read'
        const write = uM.name + '__write'

        if (item.access_list.includes(read)) {
          uM.read = true
        } else {
          uM.read = false
        }

        if (item.access_list.includes(write)) {
          uM.write = true
        } else {
          uM.write = false
        }

        accessList.push(uM)
      })

      this.newRole.access = [...accessList]
      this.newRole.name = item.name
      this.newRole.id = item.id
    },
  
    updateRole() {
      if (this.$refs.form.validate()) {
        const access = []
  
        this.newRole.access.forEach((item) => {
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
          id: this.newRole.id,
          name: this.newRole.name,
          access_list: [...access]
        }
  
        this.editLoading = true
        this.$store.dispatch('role/updateRole', payload).then(() => {
          this.$emit('refresh')
        }).finally(() => {
          this.editLoading = false
        })
      }
    }
  }
}
</script>