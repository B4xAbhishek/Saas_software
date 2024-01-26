<template>
  <v-dialog v-if="ticketDialog" v-model="ticketDialog" persistent max-width="950">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text">Edit Ticket</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <template v-if="ticketInfo && !loading">
          <v-form ref="form" lazy-validation @submit.prevent="submit">
            <v-row>
              <v-col cols="12" md="7" lg="8" :class="$vuetify.breakpoint.mdAndUp && 'right-border'">
                <div>
                  <h3 class="black--text">Ticket: {{ ticketInfo.ticket_number }} {{ ticketInfo.title }}</h3>
                  <h3 class="black--text mt-2">Date reported</h3>
                  <span class="px-0">{{ new Date(ticketInfo.created_on).toLocaleString() }}</span>
                  <h3 class="black--text mt-2">Description</h3>
                  <div
                    v-if="!editDescription"
                    class="grey lighten-4 my-1 mx-0 pa-1 cursor-pointer ticket-desc"
                    @click="editDescription = !editDescription"
                    v-html="ticketInfo.description"
                  >

                  </div>
                  <!-- <p
                    v-if="!editDescription"
                    class="px-0 mt-0 mb-1"
                  >
                    <span class="px-0 text-underline primary--text cursor-pointer" v-html="ticketInfo.description"></span>
                    <v-icon size="14" color="primary" >mdi-pencil</v-icon>
                  </p> -->

                  <template v-if="editDescription">
                    <div class="grey lighten-1">
                      <RichTextEditor
                        :value="ticketInfo.description"
                        @update="onDescriptionUpdate"
                        @hide="editDescription = false"
                      />
                    </div>

                    <p v-if="!isDescription" class="red--text ma-0">Ticket Description is required.</p>
                  </template>
                </div>
                <h3 class="black--text mb-1 mt-1">Comments:</h3>
                <v-text-field
                  v-if="!editComment"
                  outlined
                  placeholder="write your comment."
                  dense
                  @focus="editComment = true"
                ></v-text-field>
                <div class="control-section">
                  <div v-if="editComment" class="sample-container">
                    <div class="default-section mb-3">
                      <!-- <ejs-richtexteditor ref="rteObj" v-model="comment" :toolbar-settings="toolbarSettings">
                        <p>Write comment</p>
                      </ejs-richtexteditor> -->
                      <RichTextEditor @update="onCommentUpdate" />
                      <p v-if="!isComment" class="red--text ma-0">Comment is required.</p>
                      <div class="mt-2">
                        <v-btn color="primary" :loading="commentLoading" @click="postComment">Post</v-btn>
                        <v-btn
                          color="grey lighten-1 ml-1"
                          :disabled="commentLoading"
                          @click="editComment = false"
                        >Cancel</v-btn>
                      </div>
                    </div>
                  </div>
                  <div class="comment-list">
                    <div v-for="commentItem in ticketInfo.comments" :key="commentItem.created_on" class="comments mb-1">
                      <div class="comment grey lighten-4 px-2 py-1">
                        <div class="d-flex align-center">
                          <h3 v-if="commentItem.author && commentItem.author.first_name" class="black--text">{{
                            commentItem.author.first_name }} {{
                            commentItem.author.last_name
                          }}</h3>
                          <strong class="comment-date pl-1">{{ new Date(commentItem.created_on).toLocaleString()
                          }}</strong>
                        </div>

                        <span class="px-0" v-html="commentItem.comment"></span>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- <template v-if="!$vuetify.breakpoint.mdAndUp">
                  <v-btn type="submit" color="primary" :loading="editLoading">Save</v-btn>
                  <v-btn color="grey lighten-1 ml-1" :disabled="editLoading" @click="close">Cancel</v-btn>
                </template> -->
              </v-col>
              <v-col cols="12" md="5" lg="4">
                <h3 class="black--text">{{ ticketInfo.customer.first_name }} {{ ticketInfo.customer.last_name }} - {{
                  ticketInfo.customer.company_name
                }}</h3>
                <p class="mb-0 mt-0 px-0"><span class="px-0">{{ ticketInfo.customer.phone_number }}</span></p>
                <p class="mb-0 mt-0 px-0"><span class="px-0">{{ ticketInfo.customer.email }}</span></p>

                <v-autocomplete
                  v-if="isAdmin()"
                  v-model="ticketInfo.assigned_to"
                  label="Assigned To"
                  :items="admins"
                  item-text="email"
                  item-value="email"
                  :rules="required"
                >
                </v-autocomplete>

                <div v-if="deviceInfo && deviceInfo.project" class="d-flex mb-1">
                  <strong class="black--text">Project: </strong>
                  <span class="black--text pa-0 pl-1">{{ deviceInfo && deviceInfo.project.name }}</span>
                </div>

                <div v-if="deviceInfo && deviceInfo.location" class="d-flex mb-1">
                  <strong class="black--text">Location: </strong>
                  <span class="black--text pa-0 pl-1">{{ deviceInfo && deviceInfo.location.name }}</span>
                </div>

                <div v-if="deviceInfo && deviceInfo.position" class="d-flex mb-1">
                  <strong class="black--text">Position: </strong>
                  <span class="black--text pa-0 pl-1">{{ deviceInfo && deviceInfo.position.name }}</span>
                </div>

                <div v-if="deviceInfo" class="d-flex mb-1" :class="!isAdmin() && 'mt-3'">
                  <strong class="black--text pa-0">Model: </strong>
                  <span class="pa-0 pl-1">{{ deviceInfo.model.name }}</span>
                </div>

                <div v-if="deviceInfo" class="d-flex mb-1">
                  <strong class="black--text">Network: </strong>
                  <span
                    class="pa-0 pl-1 text-capitalize"
                    :class="deviceInfo.network_status === 'active' ? 'green--text' : 'red--text'"
                  >{{
                    deviceInfo.network_status
                  }}</span>
                </div>

                <v-autocomplete
                  v-if="isAdmin()"
                  v-model="ticketInfo.status"
                  label="Status"
                  :items="['open', 'closed', 'overdue', 'hold']"
                  hide-details
                >
                </v-autocomplete>

                <v-autocomplete v-if="isAdmin()" v-model="ticketInfo.priority" label="Priority" :items="['none', 'high', 'medium', 'low']">
                </v-autocomplete>

                <template v-if="!isAdmin()">
                  <div v-if="ticketInfo" class="d-flex mb-1">
                    <strong class="black--text pa-0">Status: </strong>
                    <span class="pa-0 pl-1 text-uppercase">{{ ticketInfo.status }}</span>
                  </div>

                  <div v-if="ticketInfo" class="d-flex mb-1">
                    <strong class="black--text pa-0">Priority: </strong>
                    <span class="pa-0 pl-1 text-uppercase">{{ ticketInfo.priority }}</span>
                  </div>
                </template>

                <template>
                  <v-btn type="submit" color="primary" :loading="editLoading">Save</v-btn>
                  <v-btn color="grey lighten-1 ml-1" :disabled="editLoading" @click="close">Cancel</v-btn>
                </template>
              </v-col>
            </v-row>
          </v-form>
        </template>

        <template v-if="loading">
          <div class="text-center mt-4">
            <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
            <h4>Loading Ticket...</h4>
          </div>
        </template>
        <template v-if="!loading && !ticketInfo">
          <div class="text-center mt-4">
            <h4 class="red--text">Ticket not found...</h4>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
    
<script>
import RichTextEditor from '@/components/support/RichTextEditor'
import { mapState } from 'vuex'

export default {
  components: {
    RichTextEditor
  },
  props: {
    ticketDialog: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      editLoading: false,
      commentLoading: false,
      description: null,
      editDescription: false,
      editComment: false,
      comment: null,
      deviceInfo: null,
      isDescription: true,
      isComment: true,
      admins: [],
      newComment: {
        id: null,
        comment: null
      },
      required: [(v) => !!v || 'Required']
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user
    })
  },
  created() {
    if (this.isAdmin()) {
      this.$store.dispatch('support/getAdminUsers').then((resp) => {
        this.admins = [...resp]
      })
    }
    this.getTicket()
  },
  methods: {
    getTicket() {
      this.ticketInfo = null
      this.loading = true
      this.$store.dispatch('support/getTicket', this.item.id).then((resp) => {
        this.ticketInfo = { ...resp }
        // this.ticketInfo.assigned_to = resp.assigned_to.id
        this.getDeviceInfo()
      }).finally(() => {
        this.loading = false
      })
    },
    getDeviceInfo() {
      this.deviceInfo = null
      this.$store.dispatch('device/getDeviceInfo', { id: this.ticketInfo.camera_id }).then((resp) => {
        this.deviceInfo = { ...resp }
      })
    },
    onDescriptionUpdate(value) {
      this.ticketInfo.description = value
    },
    onCommentUpdate(value) {
      this.newComment.comment = value
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDescription = true
        if (!this.ticketInfo.description) {
          this.isDescription = false

          return
        }

        let desc = this.ticketInfo.description.split('').reverse().join('').replace('<>rb', '')

        desc = desc.split('').reverse().join('')

        const payload = {
          id: this.ticketInfo.id,
          title: this.ticketInfo.title,
          description: desc,
          assigned_to: typeof this.ticketInfo.assigned_to === 'object' ? this.ticketInfo.assigned_to.id : this.ticketInfo.assigned_to,
          camera_id: this.deviceInfo.camera_id,
          priority: this.ticketInfo.priority,
          status: this.ticketInfo.status
        }

        this.editLoading = true
        this.$store.dispatch('support/updateTicket', payload).then(() => {
          this.refresh()
        }).finally(() => {
          this.editLoading = false
        })
      }
    },
    postComment() {
      if (this.newComment.comment) {
        this.commentLoading = true
        const payload = {
          id: this.ticketInfo.id,
          comment: this.newComment.comment
        }

        this.$store.dispatch('support/createTicketComment', payload).then(() => {
          this.newComment.comment = null
          this.editComment = false

          this.ticketInfo.comments.push({
            comment: payload.comment,
            author: {
              first_name: this.user.first_name,
              last_name: this.user.last_name
            },
            created_on: new Date()
          })
        }).finally(() => {
          this.commentLoading = false
        })
      } else {
        this.isComment = false
      }
    },
    close() {
      this.$emit('close')
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>
  
<style scoped>
.right-border {
  border-right: 1px solid #ddd;
}

.comment-list {
  height: 200px;
  overflow-y: auto;
  padding: 5px 5px 5px 0;
}

.comment {
  background: #ddd;
}

.comment-date {
  font-size: 11px !important;
}
</style>