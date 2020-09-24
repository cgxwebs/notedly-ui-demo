<template>
  <v-dialog :value="model" max-width="550" persistent>
    <v-card>
      <v-card-title>
        <span class="headline"
          >Are you sure you want to remove this {{ label }}?</span
        >
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('delete-canceled')" text>Cancel</v-btn>

        <v-btn @click="$emit('delete-confirmed')" color="primary" text
          >Yes</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DeleteDialog",
  props: {
    model: Boolean,
    label: String
  }
};
</script>
