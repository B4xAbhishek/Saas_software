<template>
  <div class="trade-scheduler">
    <v-card color="transparent" class="mt-3" flat>
      <v-tabs
        v-model="tab"
        background-color="transparent"
        class="text-capitalize"
        align-with-title
      >
        <v-tab>Contacts</v-tab>
        <v-tab>Companies</v-tab>
      </v-tabs>
    </v-card>
  
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Contacts />
      </v-tab-item>
      <v-tab-item>
        <Companies />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
  
<script>
// import Assign from '@/components/tradescheduler/Assign/Assign'
import Contacts from '@/components/tradescheduler/Contacts/Contacts'
import Companies from '@/components/tradescheduler/Companies/Companies'
export default {
  components: {
    Contacts,
    Companies
  },
  data() {
    return {
      tab: 0
    }
  }
}
</script>