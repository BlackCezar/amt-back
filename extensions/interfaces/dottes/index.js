import { useApi, useStores, defineInterface } from '@directus/extensions-sdk';
import { defineComponent, openBlock, createElementBlock, Fragment, createElementVNode, toDisplayString } from 'vue';

var _sfc_main = defineComponent({
  props: {
    primaryKey: {
      type: String
    },
    collection: {
      type: Object
    },
    value: {
      type: String,
      default: null
    }
  },
  emits: ["input"],
  mounted() {
    console.log(this.props, this.relationsStore, this.collectionsStore);
  },
  setup(props, { emit }) {
    useApi();
    const { useCollectionsStore, useRelationsStore } = useStores();
    const collectionsStore = useCollectionsStore();
    const relationsStore = useRelationsStore();
    function handleChange(value) {
      emit("input", value);
    }
    return { handleChange, props, relationsStore, collectionsStore };
  }
});

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _hoisted_1 = ["value"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createElementVNode(
        "div",
        null,
        toDisplayString(_ctx.primaryKey),
        1
        /* TEXT */
      ),
      createElementVNode("input", {
        value: _ctx.value,
        onInput: _cache[0] || (_cache[0] = ($event) => _ctx.handleChange($event.target.value))
      }, null, 40, _hoisted_1)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
var InterfaceComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "interface.vue"]]);

var index = defineInterface({
  id: "custom",
  name: "\u0422\u043E\u0447\u043A\u0438",
  icon: "ballot",
  description: "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u043C\u0438",
  component: InterfaceComponent,
  relational: true,
  types: ["string"],
  options: null
});
console.log("Dottes installed");

export { index as default };
