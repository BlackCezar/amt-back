<template>
  <div>
    {{ primaryKey }}
  </div>
  <input :value="value" @input="handleChange($event.target.value)" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useApi, useStores } from "@directus/extensions-sdk";

export default defineComponent({
  props: {
    primaryKey: {
      type: String,
    },
    collection: {
      type: Object,
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ["input"],
  mounted() {
    console.log(this.props, this.relationsStore, this.collectionsStore);
  },
  setup(props, { emit }) {
    const api = useApi();
    const { useCollectionsStore, useRelationsStore } = useStores();
    const collectionsStore = useCollectionsStore();
    const relationsStore = useRelationsStore();

    function handleChange(value: string): void {
      emit("input", value);
    }
    return { handleChange, props, relationsStore, collectionsStore };
  },
});
</script>
