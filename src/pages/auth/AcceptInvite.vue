<template>
  <div>
    <div v-if="inviteInfo && !isLoading">
      <NewUser v-if="!inviteInfo.has_account" :invite-info="inviteInfo" />
      <OldUser v-if="inviteInfo.has_account" :invite-info="inviteInfo" />
    </div>
    <div v-if="!inviteInfo && isLoading">
      <v-progress-circular :value="150" indeterminate color="primary"></v-progress-circular>
      <h4>Validating Invite...</h4>
    </div>
    <div v-if="!inviteInfo && !isLoading && inviteError">
      <v-card>
        <v-card-text class="text-center">
          <v-card-title
            class="justify-center display-1 mv-2 red--text"
          >{{ inviteError || 'Invite Not Found...' }}</v-card-title>
          <v-btn
            large
            to="/auth/signin"
            color="primary"
            type="submit"
          >Go to Sign in</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import NewUser from '@/components/invite/NewUser'
import OldUser from '@/components/invite/OldUser'
export default {
  components: {
    NewUser,
    OldUser
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
        .dispatch('user/getInviteInfo', this.$route.params.id)
        .then((resp) => {
          console.log(resp)
          // Check if same user already logged in
          if (this.user && this.user.email === resp.email) {
            this.redirectUser(this.user)
          } else {
            // Check if user logged in but email doesn't match
            if (this.user && this.user.email !== resp.email) {
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
      if (resp && resp.invite_id) {
        this.inviteInfo = { ...resp }
      } else {
        this.inviteError = { ...resp }
      }
    }
  }
}
</script>
