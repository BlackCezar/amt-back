import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
  id: "custom",
  name: "Точки",
  icon: "ballot",
  description: "Изображение с координатами",
  component: InterfaceComponent,
  relational: true,
  types: ["string"],
  options: null,
});
console.log("Dottes installed");
