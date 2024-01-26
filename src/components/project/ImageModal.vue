<template>
  <v-dialog v-model="open" persistent width="700px">
    <v-card>
      <v-toolbar color="white" flat>
        <v-toolbar-title class="ml-2">{{
          location.locationName || location.name
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-carousel
          v-model="model"
          height="100%"
          :continuous="false"
          :show-arrows="imagesList && imagesList.length > 1 ? true : false"
          hide-delimiters
        >
          <v-carousel-item v-for="(img, i) in imagesList" :key="i" class="carousel-item">
            <v-img :src="img.image_url" width="100%" height="100%" :lazy-src="placeholderImg"> </v-img>
            <div class="image-date black white--text">{{ format_time(img.date) }}</div>
          </v-carousel-item>
        </v-carousel>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text small color="primary" @click="$emit('close')"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    imageProp: {
      type: Array,
      default: null
    },
    location: {
      type: Object,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      position: 'EAST',
      model: 0,
      imagesList: [],
      dialog: true,
      placeholderImg: 'https://teo-dev2.sfo3.digitaloceanspaces.com/34c3fb8f-cdf5-4c77-9ac8-78b553f30eef__63ab2aa284d7c0001ca101cb.jpg',
      prevIndex: 0,
      totalNewImages: 0
    }
  },

  watch: {
    imageProp(newVal, oldVal) {
      // console.log(newVal.length, oldVal.length)
      this.totalNewImages = newVal.length - oldVal.length

      this.imagesList = [...newVal]
      console.log(this.imagesList)
      
      // this.model = index

      // this.model = (newVal.length - oldVal.length) - 2
      // console.log('MODEL : ', this.model)
      // console.log('Index : ', index)
    },
    model(newVal, oldVal) {
      // if (newVal === 1) {
      //   this.$emit('loadMore')
      // }
      // if (this.imagesList.length - newVal === 2) {
      //   this.$emit('loadMore')
      // }
    }
  },

  created() {
    if (this.imageProp.length) {
      this.imagesList = [...this.imageProp].reverse()
      this.model = this.imagesList.length - 1
    }
  },
  
  methods: {
    format_time(s) {
      return (
        new Date(new Date(s).getTime()).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }) +
        ' ' +
        new Date(s).toLocaleDateString('en-US').slice(0, 10)
      )
    }
  }
}
</script>

<style scoped>
.carousel-item {
  position: relative;
}
.image-date {
  position: absolute;
  left: 1%;
  padding: 0 4px;
  border-radius: 4px;
  bottom: 10px;
  z-index: 999;
}
</style>
