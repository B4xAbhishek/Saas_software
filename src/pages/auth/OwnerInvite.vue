<template>
  <div>
    <div v-if="inviteInfo && !isLoading">
      <NewUser :owner="true" :invite-info="inviteInfo" />
    </div>
    <div v-if="!inviteInfo && isLoading">
      <v-progress-circular :value="150" indeterminate color="primary"></v-progress-circular>
      <h4>Validating Invite...</h4>
    </div>
    <div v-if="!inviteInfo && !isLoading && inviteError">
      <v-card>
        <v-card-text class="text-center">
          <v-card-title class="justify-center display-1 mv-2 red--text">{{ inviteError || `Invite Not
                    Found...` }}</v-card-title>
          <v-btn large to="/auth/signin" color="primary" type="submit">Go to Sign in</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
  
<script>
import NewUser from '@/components/invite/NewUser'
export default {
  components: {
    NewUser
  },
  data() {
    return {
      isLoading: false,
      inviteInfo: null,
      inviteError: null,
      user: null
    }
  },
  async mounted() {
    this.isLoading = true
    await this.$store.dispatch('auth/logoutUser').finally(() => {
      this.init()
    })
  },
  methods: {
    async init() {
      this.isLoading = true
      if (this.getLoggedUser()) {
        await this.$store.dispatch('auth/getUser').then((resp) => {
          if (resp) {
            this.user = { ...resp }
          }
        }).finally(() => {
          this.isLoading = false
        })
      }
      await this.getInviteInfo()
    },
    async getInviteInfo() {
      this.isLoading = true
      this.inviteError = null
      this.inviteInfo = null

      await this.$store
        .dispatch('user/getCustomerInviteInfo', this.$route.params.id)
        .then((resp) => {
          // Check if same user already logged in
          if (this.user && this.user.email === resp.email) {
            console.log('Same Email')
            this.redirectUser(this.user)
          } else {
            // Check if user logged in but email doesn't match
            if (this.user && this.user.email !== resp.email) {
              console.log('Different Email')
              this.removeUser()
            }
            this.setInviteInfo(resp)
          }

          this.isLoading = false
        })
        .catch((err) => {
          this.inviteError = err
          this.isLoading = false
        })
    },
    setInviteInfo(resp) {
      if (resp && resp.email) {
        this.inviteInfo = { ...resp }
      } else {
        this.inviteError = { ...resp }
      }
    }
  }
}
</script>
