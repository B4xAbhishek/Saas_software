<template>
  <v-card>
    <v-card-text>
      <template v-if="add">
        <div class="d-flex justify-space-between align-center pt-2 pb-2">
          <h2>Add Device Model</h2>
          <v-icon @click="$emit('close', true)">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
      </template>
      <v-form ref="form" @submit.prevent="submit">
        <v-row align="center">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="model.name"
              label="Device Name*"
              :rules="required"
            ></v-text-field>
            <v-text-field
              v-model="model.hardware_version"
              label="Hardware Version*"
              :rules="required"
            ></v-text-field>
            <v-textarea
              v-model="model.description"
              label="Description"
              rows="4"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="4" class="text-center text-md-left">
            <v-avatar tile size="150" class="model-image">
              <img v-if="edit && model.image_url" width="100%" :src="model.image_url">
              <img v-if="!edit && pickedFile.file" :src="pickedFile.file">
              
              <v-icon v-if="(!edit && !pickedFile.file) || (edit && !model.image_url)" size="40">mdi-cloud-upload</v-icon>
            </v-avatar> <br />

            <v-btn
              v-if="add"
              type="button"
              color="primary"
              class="mt-2"
              text
              @click="uploadFile"
            >Upload Image</v-btn>
            <input
              ref="pickFile"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onFilePick"
            >
          </v-col>
          <v-col v-if="!edit" cols="12">
            <v-btn type="submit" color="primary" :loading="loading">Save</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AddEditModel',
  props: {
    add: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      pickedFile: {
        name: null,
        file: null
      },
      modelInfo: null,
      model: {
        name: null,
        hardware_version: null,
        description: null,
        image_base64: null,
        image_extension: null
      },
      required: [(v) => !!v || 'Required']
    }
  },
  created() {
    if (this.edit) {
      this.loadModel()
    }
  },
  methods: {
    loadModel() {
      const { id } = this.$route.params

      this.$store.dispatch('firmware/getDeviceModel', id).then((resp) => {
        this.model = { ...resp }
        console.log(this.model)
      })
    },
    uploadFile() {
      this.$refs.pickFile.click()
    },
    onFilePick(e) {
      const files = [...e.target.files]

      this.pickedFile.file = null
      this.pickedFile.name = null
      this.model.image_base64 = null

      if (files && files.length) {
        this.pickedFile.name = files[0].name
        this.pickedFile.file = URL.createObjectURL(files[0])

        this.model.image_extension = files[0].type.split('/')[1]

        const reader = new FileReader()

        reader.onloadend = () => {
          this.model.image_base64 = reader.result
        }
        reader.readAsDataURL(files[0])
      }
    },
    submit() {
      if (this.$refs.form.validate()) {        
        if (this.add) {
          if (!this.pickedFile || !this.pickedFile.file) {
            this.$store.commit(
              'setToast',
              {
                message: 'Please pick device model image.',
                color: 'red',
                show: true
              },
              { root: true }
            )

            return
          }

          const payload = {
            name: this.model.name,
            hardware_version: this.model.hardware_version,
            image_base64: this.model.image_base64.split(';base64,')[1],
            image_extension: this.model.image_extension,
            description: this.model.description
          }

          this.loading = true

          this.$store
            .dispatch('firmware/createDeviceModel', payload)
            .then(() => {
              this.loading = false
              this.$emit('added', true)
            // this.$router.push('/device-admin?tab=ota-firmware')
            })
            .catch(() => {
              this.loading = false
            })
        }
        if (this.edit) {
        // Edit
        }
      }
    }
  }
}
</script>

<style scoped>
.model-image, .v-avatar {
  border: 1px solid #ddd !important;
}
</style>