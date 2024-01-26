<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{ $t('forgot.title') }}</v-card-title>
      <v-card-subtitle>
        Enter your account email address and we will send you a code to reset your password.
      </v-card-subtitle>

      <!-- reset form -->
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="submit">
          <v-text-field
            v-model="data.email"
            :rules="emailRules"
            :validate-on-blur="false"
            :error="error"
            :error-messages="errorMessages"
            :label="$t('forgot.email')"
            name="email"
            outlined
            @change="resetErrors"
          ></v-text-field>

          <template v-if="isEmailSent">
            <v-text-field
              v-model="data.code"
              :rules="[rules.required]"
              :validate-on-blur="false"
              :error="error"
              :error-messages="errorMessages"
              label="Code"
              name="code"
              outlined
            ></v-text-field>

            <v-text-field
              v-model="data.new_password"
              :rules="passwordRules"
              :validate-on-blur="false"
              :error="error"
              :error-messages="errorMessages"
              label="New Password"
              name="password"
              outlined
            ></v-text-field>
          </template>

          <v-btn
            :loading="isLoading"
            block
            x-large
            color="primary"
            @click="submit"
          >{{ $t('forgot.button') }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="text-center mt-6">
      <router-link to="/auth/signin">
        {{ $t('forgot.backtosign') }}
      </router-link>
    </div>
  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Forgot Page Component
|---------------------------------------------------------------------
|
| Template to send email to remember/replace password
|
*/
export default {
  data() {
    return {
      // reset button
      isLoading: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => !!v && v.length >= 8 || 'Password should contain minimum 8 characters.'
      ],
      isEmailSent: false,

      data: {
        email: null,
        code: null,
        new_password: null
      },

      // form
      isFormValid: true,
      email: '',

      // form error
      error: false,
      errorMessages: '',

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Code is Required'
      }
    }
  },
  methods: {
    submit(e) {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        if (this.isEmailSent) {
          // Submit New Password
          this.$store.dispatch('auth/recoverPassword', { ...this.data }).then(() => {
            this.isEmailSent = true
          }).finally(() => {
            this.isLoading = false
          })
        } else {
          // Send Email
          this.$store.dispatch('auth/forgetPassword', { email: this.data.email }).then(() => {
            this.isEmailSent = true
          }).finally(() => {
            this.isLoading = false
          })
        }
      }
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''
    }
  }
}
</script>
