<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">Welcome</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            :validate-on-blur="false"
            :error="error"
            :label="$t('login.email')"
            name="email"
            outlined
            @keyup.enter="submit"
            @change="resetErrors"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            :error="error"
            :error-messages="errorMessages"
            :label="$t('login.password')"
            name="password"
            outlined
            @change="resetErrors"
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            :disabled="isLoading"
            block
            x-large
            color="primary"
            type="submit"
          >{{ $t("login.button") }}</v-btn>

          <!-- <div class="caption font-weight-bold text-uppercase my-3">{{ $t('login.orsign') }}</div> -->

          <!-- external providers list -->
          <!-- <v-btn
            v-for="provider in providers"
            :key="provider.id"
            :loading="provider.isLoading"
            :disabled="isSignInDisabled"
            class="mb-2 primary lighten-2 primary--text text--darken-3"
            block
            x-large
            to="/"
          >
            <v-icon small left>mdi-{{ provider.id }}</v-icon>
            {{ provider.label }}
          </v-btn> -->

          <!-- <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div> -->

          <div class="mt-5">
            <router-link to="/auth/forgot-password">
              {{ $t("login.forgot") }}
            </router-link>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Sign In Page Component
|---------------------------------------------------------------------
|
| Sign in template for user authentication into the application
|
*/
export default {
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      isFormValid: true,
      email: '',
      password: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [(v) => !!v || 'Password is required'],

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      providers: [
        {
          id: 'google',
          label: 'Google',
          isLoading: false
        },
        {
          id: 'facebook',
          label: 'Facebook',
          isLoading: false
        }
      ],

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  mounted() {
    if (this.getLoggedUser()) {
      this.$router.push('/')
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        await this.$store
          .dispatch('auth/loginUser', {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$store.dispatch('auth/getUser').then((user) => {
              this.redirectUser()
            }).catch(() => {
              this.isLoading = false
            })
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    },
    signIn(email, password) {
      this.$router.push('/')
    },
    signInProvider(provider) {},
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
