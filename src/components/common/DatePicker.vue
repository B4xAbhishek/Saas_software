<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="true"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="datePicked"
        placeholder="Select Date"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        hide-details
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="datePicked"
      color="primary"
      :min="minDate"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    date: {
      type: String || Date,
      default: null
    }   
  },
  data() {
    return {
      menu: false,
      minDate: null,
      datePicked: null
    }
  },
  watch: {
    datePicked(val, old) {
      if (old !== null && (val !== old)) {
        this.updateDate()  
      }
    }
  },
  created() {
    if (this.date && typeof this.date === 'string') {
      this.datePicked = new Date(this.date).toISOString().split('T')[0]
    }
    else {
      this.datePicked = new Date().toISOString().split('T')[0]
    }
    
    const val = new Date()  
    const nextDay = val.setDate(val.getDate() + 1)

    this.minDate = new Date(nextDay).toISOString().split('T')[0]
  },
  methods: {
    updateDate() {
      console.log(this.datePicked)
      this.$emit('update', this.datePicked)
    }
  }
}
</script>