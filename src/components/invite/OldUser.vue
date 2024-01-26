<template>
  <v-form ref="form" lazy-validation @submit.prevent="submit">
    <v-card class="">
      <v-card-title
        class="justify-center display-1 mv-2"
      >Accept Invite</v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="6" class="px-2">
            <v-text-field
              v-model="user.email"
              :rules="emailRules"
              :validate-on-blur="false"
              :error="error"
              label="Email"
              name="email"
              disabled
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="px-2">
            <v-text-field
              v-model="user.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="showPassword ? 'text' : 'password'"
              :error="error"
              :error-messages="errorMessages"
              label="Password"
              name="password"
              outlined
              dense
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
export default {
  props: {
    inviteInfo: {
      type: Object,
      default: null
    }
  },
  
  data() {
    return {
      user: {
        id: this.$route.params.id,
        email: null,
        password: null
      },
      saveLoading: false,
      // form
      isFormValid: true,
      error: false,
      errorMessages: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [(v) => !!v || 'Password is required'],
      showPassword: false
    }
  },

  watch: {
    inviteInfo(val) {
      if (val) {
        this.user.email = val.email
      }
    }
  },
  created() {
    if (this.inviteInfo) {
      this.user.email = this.inviteInfo.email
    }
  },
  async submit() {
    if (this.$refs.form.validate()) {
      this.saveLoading = true
      const login = {
        email: this.user.email,
        password: this.user.password
      }

      this.user.id = this.$route.params.id

      this.$store.dispatch('auth/loginUser', login).then(async (user) => {
        if (user.access_token) {
          await this.$store.dispatch('user/acceptInviteForOldUser', this.user).then(async() => {
            await this.$store.dispatch('auth/getUser')
            this.redirectUser(user.data)
          }).catch(() => {
            this.saveLoading = false
          })
        }
        this.saveLoading = false
      }).catch(() => {
        this.saveLoading = false
      })
      this.saveLoading = false
    }
  }
}
</script>